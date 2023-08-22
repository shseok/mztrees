import {
  Bookmark,
  Item,
  ItemLike,
  ItemStats,
  Publisher,
  Thumbnail,
  User,
} from '@prisma/client'
import AppError from '../lib/AppError.js'
import db from '../lib/db.js'
import { extractImageUrls, extractPageInfo } from '../lib/extractPageInfo.js'
import { PaginationOptionType, createPagination } from '../lib/pagination.js'
import algolia from '../lib/algolia.js'
import { calculateScore } from '../lib/ranking.js'
import { checkDateFormat, checkWeekRange } from '../lib/checkDate.js'
import imageService from './image.service.js'

const isR2Disbled = process.env.R2_DISABLED === 'true'

const itemService = {
  async makeImageUrl({
    url,
    type,
    id,
  }: {
    url: string
    type: 'item' | 'publisher'
    id: number
  }) {
    const { buffer, extension } = await imageService.downloadFile(url)
    const key = imageService.createFileKey({
      type,
      id,
      extension: extension || 'png',
    })

    await imageService.uploadFile(key, buffer)
    return { key, imageUrl: `https://img.mztrees.com/${key}` }
  },
  async getRegionInfo(regionCategory: string, area: string) {
    const regionInfo = await db.regionCategory.findUnique({
      where: {
        name: regionCategory,
      },
    })

    if (!regionInfo) {
      throw new AppError('NotFound')
    }

    const areaInfo = await db.area.findUnique({
      where: {
        name_regionCategoryId: {
          regionCategoryId: regionInfo.id,
          name: area,
        },
      },
    })

    if (!areaInfo) {
      throw new AppError('NotFound')
    }

    return { regionCategoryId: regionInfo.id, areaId: areaInfo.id }
  },
  async getPublisher({ domain, name, favicon }: GetPublisherParams) {
    const exists = await db.publisher.findUnique({
      where: {
        domain,
      },
    })
    if (exists) {
      return exists
    }
    const publisher = await db.publisher.create({
      data: {
        domain,
        name,
        favicon,
      },
    })

    if (favicon && !isR2Disbled) {
      const { imageUrl } = await this.makeImageUrl({
        url: favicon,
        type: 'publisher',
        id: publisher.id,
      })
      publisher.favicon = imageUrl
      await db.publisher.update({
        where: {
          id: publisher.id,
        },
        data: {
          favicon: imageUrl,
        },
      })
    }

    return publisher
  },

  async getImageUrls(link: string) {
    const urls = await extractImageUrls(link)
    const info = await extractPageInfo(link)
    const concatedArr = info.thumbnail ? [...urls, info.thumbnail] : urls
    return [...new Set(concatedArr)]
  },

  async createItem(
    userId: number,
    {
      title,
      body,
      link,
      thumbnail: refUrl,
      regionCategory,
      area,
      tags,
    }: mutateItemParams,
  ) {
    const info = await extractPageInfo(link)
    const publisher = await this.getPublisher({
      domain: info.domain,
      name: info.publisher,
      favicon: info.favicon,
    })
    const { regionCategoryId, areaId } = await this.getRegionInfo(
      regionCategory,
      area,
    )

    const item = await db.item.create({
      data: {
        title,
        body,
        link: info.url,
        userId,
        author: info.author ?? undefined,
        publisherId: publisher.id,
        regionCategoryId,
        areaId,
      },
      include: {
        user: true,
        publisher: true,
        regionCategory: true,
        area: true,
      },
    })
    const itemStats = await db.itemStats.create({
      data: {
        itemId: item.id,
      },
    })
    const itemWithItemStats = { ...item, itemStats }
    let thumbnailInfo: Thumbnail | null = null
    try {
      if (refUrl && !isR2Disbled) {
        const { imageUrl, key } = await this.makeImageUrl({
          url: refUrl,
          type: 'item',
          id: item.id,
        })
        thumbnailInfo = await db.thumbnail.create({
          data: {
            ref: refUrl,
            url: imageUrl,
            key,
          },
        })
        itemWithItemStats.thumbnailId = thumbnailInfo.id
        await db.item.update({
          where: {
            id: item.id,
          },
          data: {
            thumbnailId: thumbnailInfo.id,
          },
        })
      }
    } catch (e) {}

    algolia
      .sync({
        id: item.id,
        title: item.title,
        body: item.body,
        author: item.author,
        link: item.link,
        thumbnail: thumbnailInfo?.url ?? refUrl ?? null,
        username: item.user.username,
        publisher: item.publisher,
      })
      .catch(console.error)

    return this.serialize(itemWithItemStats)
  },

  async getItem(id: number, userId: number | null = null) {
    const item = await db.item.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        publisher: true,
        itemStats: true,
        thumbnail: true,
        regionCategory: true,
        area: true,
        itemLikes: userId ? { where: { userId } } : false,
        bookmarks: userId ? { where: { userId } } : false,
      },
    })
    if (!item) {
      throw new AppError('NotFound')
    }
    return this.serialize(item)
  },

  serialize<
    T extends Item & { itemLikes?: ItemLike[]; bookmarks?: Bookmark[] },
  >(item: T) {
    return {
      ...item,
      isLiked: !!item.itemLikes?.length,
      isBookmarked: !!item.bookmarks?.length,
    }
  },

  async getRecentItems({
    limit,
    cursor,
    userId,
  }: {
    limit: number
    cursor?: number | null
    userId?: number
  }) {
    const [totalCount, list] = await Promise.all([
      db.item.count(),
      db.item.findMany({
        orderBy: {
          id: 'desc',
        },
        where: {
          id: cursor
            ? {
                lt: cursor,
              }
            : undefined,
        },
        include: {
          user: true,
          publisher: true,
          itemStats: true,
          thumbnail: true,
          regionCategory: true,
          area: true,
          itemLikes: userId ? { where: { userId } } : false,
          bookmarks: userId ? { where: { userId } } : false,
        },
        take: limit,
      }),
    ])

    const endCursor = list.at(-1)?.id ?? null
    const hasNextPage = endCursor
      ? (await db.item.count({
          where: { id: { lte: endCursor } },
          orderBy: { id: 'desc' },
        })) > 0
      : false

    return { totalCount, endCursor, hasNextPage, list }
  },

  async getPastItems({
    limit,
    cursor,
    startDate,
    endDate,
    userId,
  }: {
    limit: number
    cursor?: number | null
    startDate?: string
    endDate?: string
    userId?: number
  }) {
    if (!startDate || !endDate) {
      throw new AppError('BadRequest', {
        message: 'startDate and endDate are required',
      })
    }

    checkDateFormat({ startDate, endDate })
    checkWeekRange({ startDate, endDate })

    const startedAt = new Date(`${startDate} 00:00:00`)
    const endedAt = new Date(`${endDate} 23:59:59`)

    const cursorItem = cursor
      ? await db.item.findUnique({
          where: {
            id: cursor,
          },
          include: {
            itemStats: true,
          },
        })
      : null

    const [totalCount, list] = await Promise.all([
      db.item.count({
        where: {
          createdAt: {
            gte: startedAt,
            lte: endedAt,
          },
        },
      }),
      db.item.findMany({
        orderBy: [
          {
            itemStats: {
              likes: 'desc',
            },
          },
          {
            id: 'desc',
          },
        ],
        where: {
          id: cursor
            ? {
                lt: cursor,
              }
            : undefined,
          createdAt: {
            gte: startedAt,
            lte: endedAt,
          },
          itemStats: cursorItem
            ? {
                likes: {
                  lt: cursorItem.itemStats?.likes ?? 0,
                },
              }
            : undefined,
        },
        include: {
          user: true,
          publisher: true,
          itemStats: true,
          thumbnail: true,
          regionCategory: true,
          area: true,
          itemLikes: userId ? { where: { userId } } : false,
          bookmarks: userId ? { where: { userId } } : false,
        },
        take: limit,
      }),
    ])
    const endCursor = list.at(-1)?.id ?? null
    const hasNextPage = endCursor
      ? (await db.item.count({
          where: {
            id: { lte: endCursor },
            createdAt: {
              gte: startedAt,
              lte: endedAt,
            },
          },
          orderBy: [
            {
              itemStats: {
                likes: 'desc',
              },
            },
            {
              id: 'desc',
            },
          ],
        })) > 0
      : false

    return { totalCount, endCursor, hasNextPage, list }
  },

  async getTrendingItems({
    limit,
    cursor,
    userId,
  }: {
    limit: number
    cursor?: number | null
    userId?: number
  }) {
    // TODO: 당장 많은 데이터를 트렌딩으로 보여주는게 아니므로 몇 점이상 부터 노출시킬지는 나중에 정하자
    const totalCount = await db.itemStats.count({
      where: {
        score: {
          gte: 0.001,
        },
      },
    })

    const cursorItem = cursor
      ? await db.item.findUnique({
          where: {
            id: cursor,
          },
          include: {
            itemStats: true,
          },
        })
      : null

    // TODO: cursor보다 높은 id의 값은 고려를 아예안하더라
    // itemId: 8> - score: 6 | itemId: 9 > - score: 5 | itemId: 7 > - score: 4 인 경우 itemId 7의 경우만 가져오는 현상
    const list = await db.item.findMany({
      where: {
        ...(cursor
          ? {
              id: { lt: cursor },
            }
          : {}),
        itemStats: {
          score: {
            gte: 0.001,
            ...(cursorItem
              ? {
                  lte: cursorItem.itemStats?.score,
                }
              : {}),
          },
        },
      },
      orderBy: [
        {
          itemStats: {
            score: 'desc',
          },
        },
        {
          itemStats: {
            itemId: 'desc',
          },
        },
      ],
      include: {
        user: true,
        publisher: true,
        itemStats: true,
        thumbnail: true,
        regionCategory: true,
        area: true,
        itemLikes: userId ? { where: { userId } } : false,
        bookmarks: userId ? { where: { userId } } : false,
      },
      take: limit,
    })
    const endCursor = list.at(-1)?.id ?? null

    const hasNextPage = endCursor
      ? (await db.item.count({
          where: {
            itemStats: {
              itemId: {
                lt: endCursor,
              },
              score: {
                gte: 0.001,
                lte: list.at(-1)?.itemStats?.score,
              },
            },
          },
          orderBy: [
            {
              itemStats: {
                score: 'desc',
              },
            },
            {
              itemStats: {
                itemId: 'desc',
              },
            },
          ],
        })) > 0
      : false

    return { totalCount, endCursor, hasNextPage, list }
  },

  async getItems(
    {
      mode,
      cursor,
      limit,
      userId,
      startDate,
      endDate,
    }: GetItemsParams & PaginationOptionType & { userId?: number } = {
      mode: 'recent',
    },
  ) {
    const _limit = limit ?? 20

    const { totalCount, endCursor, hasNextPage, list } = await (() => {
      if (mode === 'recent') {
        return this.getRecentItems({ limit: _limit, cursor, userId })
      }
      if (mode === 'past') {
        return this.getPastItems({
          limit: _limit,
          cursor,
          startDate,
          endDate,
          userId,
        })
      }

      // mode === 'trending'
      return this.getTrendingItems({ limit: _limit, cursor, userId })
    })()

    const serializedList = list.map(this.serialize)

    return createPagination({
      list: serializedList,
      totalCount,
      pageInfo: {
        endCursor,
        hasNextPage,
      },
    })
  },

  async getItemsByIds(itemIds: number[], userId?: number) {
    const result = await db.item.findMany({
      where: {
        id: {
          in: itemIds,
        },
      },
      include: {
        user: true,
        publisher: true,
        itemStats: true,
        itemLikes: userId ? { where: { userId } } : false,
        bookmarks: userId ? { where: { userId } } : false,
      },
    })

    type FullItem = Item & {
      user: User
      publisher: Publisher
      itemStats: ItemStats | null
    }

    const itemMap = result.reduce<Record<number, FullItem>>((acc, item) => {
      acc[item.id] = this.serialize(item)
      return acc
    }, {})

    return itemMap
  },

  async updateItem(
    userId: number,
    itemId: number,
    {
      title,
      body,
      link,
      thumbnail: refUrl,
      regionCategory,
      area,
      tags,
    }: mutateItemParams,
  ) {
    const item = await this.getItem(itemId)
    if (item.userId !== userId) {
      throw new AppError('Forbidden')
    }
    const { regionCategoryId, areaId } = await this.getRegionInfo(
      regionCategory,
      area,
    )
    const updatedItem = await db.item.update({
      where: {
        id: itemId,
      },
      data: {
        title,
        body,
        link,
        regionCategoryId,
        areaId,
      },
      include: {
        user: true,
        publisher: true,
        itemStats: true,
        thumbnail: true,
        regionCategory: true,
        area: true,
        itemLikes: userId ? { where: { userId } } : false,
        bookmarks: userId ? { where: { userId } } : false,
      },
    })

    let thumbnailInfo: Thumbnail | null = null
    // TODO: refactoring
    if (updatedItem.thumbnailId) {
      thumbnailInfo = await db.thumbnail.findUnique({
        where: {
          id: updatedItem.thumbnailId,
        },
      })
      // 받은 urlRef와 같다면 아래 로직 실행 x
      if (thumbnailInfo && thumbnailInfo.url !== refUrl) {
        try {
          if (refUrl && !isR2Disbled) {
            // delete img object in r2
            await imageService.deleteFile(thumbnailInfo.key!)

            const { imageUrl, key } = await this.makeImageUrl({
              url: refUrl,
              type: 'item',
              id: item.id,
            })

            await db.thumbnail.update({
              where: {
                id: thumbnailInfo.id,
              },
              data: {
                key,
                ref: refUrl,
                url: imageUrl,
              },
            })
          }
        } catch (e) {}
      }
    } else {
      // 이전에 thumnail이 없던 경우
      try {
        if (refUrl && !isR2Disbled) {
          const { imageUrl, key } = await this.makeImageUrl({
            url: refUrl,
            type: 'item',
            id: item.id,
          })
          thumbnailInfo = await db.thumbnail.create({
            data: {
              ref: refUrl,
              url: imageUrl,
              key,
            },
          })

          await db.item.update({
            where: {
              id: item.id,
            },
            data: {
              thumbnailId: thumbnailInfo.id,
            },
          })
        }
      } catch (e) {}
    }

    algolia
      .update({
        id: item.id,
        title,
        body,
        author: item.author,
        link: item.link,
        thumbnail: thumbnailInfo?.url ?? item.thumbnail?.url ?? refUrl ?? null,
        username: item.user.username,
        publisher: item.publisher,
      })
      .catch(console.error)

    return this.serialize(updatedItem)
  },

  async deleteItem({ itemId, userId }: ItemActionParams) {
    const item = await this.getItem(itemId)
    if (item.userId !== userId) {
      throw new AppError('Forbidden')
    }
    await db.item.delete({
      where: {
        id: itemId,
      },
    })

    algolia.delete(itemId).catch(console.error)
  },

  async countLikes(itemId: number) {
    const count = await db.itemLike.count({
      where: {
        itemId,
      },
    })

    return count
  },

  async updateItemLikes({ itemId, likes }: UpdateItemLikesParams) {
    return db.itemStats.update({
      data: {
        likes,
      },
      where: {
        itemId,
      },
    })
  },

  async likeItem({ itemId, userId }: ItemActionParams) {
    const alreadyLiked = await db.itemLike.findUnique({
      where: {
        itemId_userId: {
          itemId,
          userId,
        },
      },
    })
    if (!alreadyLiked) {
      try {
        await db.itemLike.create({
          data: {
            itemId,
            userId,
          },
        })
      } catch (e) {}
    }
    const likes = await this.countLikes(itemId)
    const itemStats = await this.updateItemLikes({ itemId, likes })
    this.recalculateRanking(itemId, likes).catch(console.error)
    return itemStats
  },

  async unlikeItem({ itemId, userId }: ItemActionParams) {
    try {
      await db.itemLike.delete({
        where: {
          itemId_userId: {
            itemId,
            userId,
          },
        },
      })
    } catch (e) {}
    const likes = await this.countLikes(itemId)
    const itemStats = await this.updateItemLikes({ itemId, likes })
    this.recalculateRanking(itemId, likes).catch(console.error)
    return itemStats
  },
  async recalculateRanking(itemId: number, likeCount?: number) {
    const item = await db.item.findUnique({
      where: {
        id: itemId,
      },
    })
    if (!item) return

    const likes = likeCount ?? (await this.countLikes(itemId))
    const curTime = new Date().getTime()
    const pastIime = new Date(item.createdAt).getTime()
    const hourAge = (curTime - pastIime) / 1000 / 60 / 60
    const score = calculateScore(likes, hourAge)

    await db.itemStats.update({
      data: {
        score,
      },
      where: {
        itemId,
      },
    })
  },
}

export default itemService

type GetItemsParams = {
  mode: 'trending' | 'recent' | 'past'
  startDate?: string
  endDate?: string
}

interface mutateItemParams {
  title: string
  body: string
  link: string
  thumbnail?: string
  regionCategory: string
  area: string
  tags?: string[]
}

interface ItemActionParams {
  itemId: number
  userId: number
}

interface GetPublisherParams {
  domain: string
  name: string
  favicon: string | null
}

interface UpdateItemLikesParams {
  itemId: number
  likes: number
}

interface GetItemLikedParams {
  userId: number
  itemIds: number[]
}
