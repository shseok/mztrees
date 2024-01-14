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
import sharp from 'sharp'

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
    let compressedBuffer: Buffer | null = null
    if (extension !== 'gif') {
      compressedBuffer = await sharp(buffer)
        .rotate()
        .jpeg({ mozjpeg: true })
        .toBuffer()
    }

    const key = imageService.createFileKey({
      type,
      id,
      extension: extension || 'png',
    })
    await imageService.uploadFile(key, compressedBuffer ?? buffer)

    return { key, imageUrl: `https://img.mztrees.com/${key}` }
  },
  async getTagsForItem(itemId: number) {
    const tags = await db.itemsTags.findMany({
      where: { itemId },
      include: { tag: true },
    })

    return tags.map((tag) => tag.tag.name)
  },
  async createTagsForItem({
    item,
    tags,
  }: {
    item: Item & {
      user: User
      publisher: Publisher
    }
    tags?: string[]
  }) {
    const createdTags = []
    if (!tags) return
    for (const tagName of tags) {
      // 태그가 이미 존재하는지 확인
      let tag = await db.tag.findUnique({
        where: { name: tagName },
      })

      if (!tag) {
        // 태그가 존재하지 않으면 새로운 태그 생성
        tag = await db.tag.create({
          data: { name: tagName },
        })
      }

      // 아이템과 태그를 연결
      await db.itemsTags.create({
        data: {
          itemId: item.id,
          tagId: tag.id,
        },
      })

      createdTags.push(tag.name)
    }

    return createdTags
  },
  async updateTagsForItem({
    itemId,
    tags,
  }: {
    itemId: number
    tags?: string[]
  }) {
    if (!tags) return
    // 이전에 연결된 아이템과 태그의 연결을 제거
    await db.itemsTags.deleteMany({
      where: { itemId },
    })
    // 새로운 태그 배열을 사용하여 아이템과 태그를 새로 연결
    for (const tagName of tags) {
      const tag = await db.tag.findUnique({
        where: { name: tagName },
      })

      if (tag) {
        // 이미 존재하는 태그와 아이템을 연결
        await db.itemsTags.create({
          data: {
            itemId: itemId,
            tagId: tag.id,
          },
        })
      }
    }
    return tags
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
    //TODO: refactor using duplicated validateUrl function
    const info = await extractPageInfo(link)
    const urls = await extractImageUrls(link)
    const concatedArr = info.thumbnail ? [...urls, info.thumbnail] : urls
    return [...new Set(concatedArr)]
  },

  async createItem(
    userId: number,
    { title, body, link, thumbnail: refUrl, tags }: mutateItemParams,
  ) {
    const info = await extractPageInfo(link)
    const publisher = await this.getPublisher({
      domain: info.domain,
      name: info.publisher,
      favicon: info.favicon,
    })

    const item = await db.item.create({
      data: {
        title,
        body,
        link: info.url,
        userId,
        author: info.author ?? undefined,
        publisherId: publisher.id,
      },
      include: {
        user: true,
        publisher: true,
      },
    })
    const createdTags =
      tags === undefined || tags.length === 0
        ? []
        : await this.createTagsForItem({ item, tags })
    const itemStats = await db.itemStats.create({
      data: {
        itemId: item.id,
      },
    })
    const itemWithItemStats = { ...item, itemStats, tags: createdTags }

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
    } catch (e) {
      console.log(e)
    }
    // TODO: add tags
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

  async getAllItems() {
    const items = await db.item.findMany({
      select: {
        id: true,
        updatedAt: true,
      },
      // Google's limit is 50,000 URLs per sitemap
      take: 50000,
    })
    if (!items) {
      throw new AppError('NotFound')
    }
    return items
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
        itemsTags: true,
        itemLikes: userId ? { where: { userId } } : false,
        bookmarks: userId ? { where: { userId } } : false,
      },
    })
    if (!item) {
      throw new AppError('NotFound')
    }
    const tags = item.itemsTags.length > 0 ? await this.getTagsForItem(id) : []
    return this.serialize({ ...item, tags })
  },

  serialize<
    T extends Item & {
      itemLikes?: ItemLike[]
      bookmarks?: Bookmark[]
    },
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
    tag,
  }: {
    limit: number
    cursor?: number | null
    userId?: number
    tag?: string
  }) {
    // const tagIds = await db.tag.findMany({
    //   where: {
    //     name: {
    //       in: tags, // tags 배열에 포함된 태그들만 가져옴
    //     },
    //   },
    //   select: {
    //     id: true, // 태그의 ID만 선택
    //   },
    // })

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
          ...(tag && {
            itemsTags: {
              some: {
                tag: {
                  name: {
                    equals: tag, // 같은 태그의 item을 가져옴
                  },
                },
              },
            },
          }),
        },
        include: {
          user: true,
          publisher: true,
          itemStats: true,
          thumbnail: true,
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
    tag,
  }: {
    limit: number
    cursor?: number | null
    startDate?: string
    endDate?: string
    userId?: number
    tag?: string
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
          ...(tag && {
            itemsTags: {
              some: {
                tag: {
                  name: {
                    equals: tag, // 같은 태그의 item을 가져옴
                  },
                },
              },
            },
          }),
        },
        include: {
          user: true,
          publisher: true,
          itemStats: true,
          thumbnail: true,
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
    tag,
  }: {
    limit: number
    cursor?: number | null
    userId?: number
    tag?: string
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
        ...(tag && {
          itemsTags: {
            some: {
              tag: {
                name: {
                  equals: tag, // 같은 태그의 item을 가져옴
                },
              },
            },
          },
        }),
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
      tag,
      cursor,
      limit,
      userId,
      startDate,
      endDate,
    }: GetItemsParams & PaginationOptionType & { userId?: number } = {
      mode: 'recent',
    },
  ) {
    const _limit = limit ?? 9

    const { totalCount, endCursor, hasNextPage, list } = await (() => {
      if (mode === 'recent') {
        return this.getRecentItems({ limit: _limit, cursor, userId, tag })
      }
      if (mode === 'past') {
        return this.getPastItems({
          limit: _limit,
          cursor,
          startDate,
          endDate,
          userId,
          tag,
        })
      }

      // mode === 'trending'
      return this.getTrendingItems({ limit: _limit, cursor, userId, tag })
    })()

    const serializedList = list.map(this.serialize)
    const serializedListWithTags = await Promise.all(
      serializedList.map(async (item) => ({
        ...item,
        tag: await this.getTagsForItem(item.id),
      })),
    )
    return createPagination({
      list: serializedListWithTags,
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
    { title, body, link, thumbnail: refUrl, tags }: mutateItemParams,
  ) {
    const item = await this.getItem(itemId)
    if (item.userId !== userId) {
      throw new AppError('Forbidden')
    }
    const updatedItem = await db.item.update({
      where: {
        id: itemId,
      },
      data: {
        title,
        body,
        link,
      },
      include: {
        user: true,
        publisher: true,
        itemStats: true,
        thumbnail: true,
        itemLikes: userId ? { where: { userId } } : false,
        bookmarks: userId ? { where: { userId } } : false,
      },
    })
    const updatedTags =
      tags === undefined || tags.length === 0
        ? await this.getTagsForItem(updatedItem.id)
        : await this.updateTagsForItem({
            itemId: updatedItem.id,
            tags,
          })
    let thumbnailInfo: Thumbnail | null = null
    // TODO: refactoring
    if (updatedItem.thumbnailId) {
      thumbnailInfo = await db.thumbnail.findUnique({
        where: {
          id: updatedItem.thumbnailId,
        },
      })
      // 받은 Url와 이전 Url이 다른 경우 업데이트
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

            thumbnailInfo = await db.thumbnail.update({
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
      } catch (e) {
        console.error(e)
      }
    }
    // TODO: add tags
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

    return this.serialize({ ...updatedItem, tags: updatedTags })
  },

  async deleteItem({ itemId, userId }: ItemActionParams) {
    const item = await this.getItem(itemId)
    if (item.userId !== userId) {
      throw new AppError('Forbidden')
    }
    if (item.thumbnail) {
      // console.log('test', item.thumbnail.key)
      await imageService.deleteFile(item.thumbnail.key)
      await db.thumbnail.delete({
        where: {
          id: item.thumbnailId!,
        },
      })
    }
    await db.itemsTags.deleteMany({
      where: {
        itemId,
      },
    })
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
  tag?: string
  startDate?: string
  endDate?: string
}

interface mutateItemParams {
  title: string
  body: string
  link: string
  thumbnail?: string
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
