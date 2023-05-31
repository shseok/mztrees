import { Item, ItemLike, ItemStats, Publisher, User } from '@prisma/client'
import AppError from '../lib/AppError.js'
import db from '../lib/db.js'
import { extractPageInfo } from '../lib/extractPageInfo.js'
import { PaginationOptionType, createPagination } from '../lib/pagination.js'
import { CreateItemBodyType } from '../routes/api/items/schema.js'
import algolia from '../lib/algolia.js'
import { calculateScore } from '../lib/ranking.js'

class ItemService {
  private static instance: ItemService
  public static getInstance(): ItemService {
    if (!ItemService.instance) {
      ItemService.instance = new ItemService()
    }
    return ItemService.instance
  }
  private async getPublisher({ domain, name, favicon }: GetPublisherParams) {
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

    return publisher
  }

  async createItem(
    userId: number,
    { title, body, link, tags }: CreateItemBodyType,
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
        thumbnail: info.thumbnail,
        author: info.author ?? undefined,
        publisherId: publisher.id,
      },
      include: {
        user: true,
        publisher: true,
      },
    })
    const itemStats = await db.itemStats.create({
      data: {
        itemId: item.id,
      },
    })

    const itemWithItemStats = { ...item, itemStats }
    const itemLikedMap = userId
      ? await this.getItemLikedMap({ userId, itemIds: [item.id] })
      : null

    algolia
      .sync({
        id: item.id,
        title: item.title,
        body: item.body,
        author: item.author,
        link: item.link,
        thumbnail: item.thumbnail,
        username: item.user.username,
        publisher: item.publisher,
      })
      .catch(console.error)

    return this.mergeItemLiked(itemWithItemStats, itemLikedMap?.[item.id])
  }

  async getItem(id: number, userId: number | null = null) {
    const item = await db.item.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        publisher: true,
        itemStats: true,
      },
    })
    if (!item) {
      throw new AppError('NotFoundError')
    }
    const itemLikedMap = userId
      ? await this.getItemLikedMap({ userId, itemIds: [id] })
      : null

    return this.mergeItemLiked(item, itemLikedMap?.[id])
  }

  private mergeItemLiked<T extends Item>(item: T, itemLike?: ItemLike) {
    return {
      ...item,
      isLiked: !!itemLike,
    }
  }

  async getRecentItems({
    limit,
    cursor,
  }: {
    limit: number
    cursor?: number | null
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
  }

  async getTrendingItems({
    limit,
    cursor,
  }: {
    limit: number
    cursor?: number | null
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
  }

  async getItems(
    {
      mode,
      cursor,
      limit,
      userId,
    }: GetItemsParams & PaginationOptionType & { userId?: number } = {
      mode: 'recent',
    },
  ) {
    const { totalCount, endCursor, hasNextPage, list } = await (() => {
      if (mode === 'recent') {
        return this.getRecentItems({ limit: limit ?? 20, cursor })
      }
      if (mode === 'past') {
      }

      // mode === 'trending'
      return this.getTrendingItems({ limit: limit ?? 20, cursor })
    })()

    const itemLikedMap = userId
      ? await this.getItemLikedMap({
          userId: userId,
          itemIds: list.map((item) => item.id),
        })
      : null
    const listWithLiked = list.map((item) =>
      this.mergeItemLiked(item, itemLikedMap?.[item.id]),
    )

    return createPagination({
      list: listWithLiked,
      totalCount,
      pageInfo: {
        endCursor,
        hasNextPage,
      },
    })
  }

  async getItemsByIds(itemIds: number[]) {
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
      },
    })

    type FullItem = Item & {
      user: User
      publisher: Publisher
      itemStats: ItemStats | null
    }

    const itemMap = result.reduce<Record<number, FullItem>>((acc, item) => {
      acc[item.id] = item
      return acc
    }, {})

    return itemMap
  }

  async updateItem({ itemId, userId, title, body }: UpdateItemParams) {
    const item = await this.getItem(itemId)
    if (item.userId !== userId) {
      throw new AppError('ForbiddenError')
    }
    const updatedItem = await db.item.update({
      where: {
        id: itemId,
      },
      data: {
        title,
        body,
      },
      include: {
        user: true,
        publisher: true,
        itemStats: true,
      },
    })
    const itemLikedMap = userId
      ? await this.getItemLikedMap({ userId, itemIds: [itemId] })
      : null

    algolia
      .update({
        id: item.id,
        title,
        body,
        author: item.author,
        link: item.link,
        thumbnail: item.thumbnail,
        username: item.user.username,
        publisher: item.publisher,
      })
      .catch(console.error)

    return this.mergeItemLiked(updatedItem, itemLikedMap?.[itemId])
  }

  async deleteItem({ itemId, userId }: ItemActionParams) {
    const item = await this.getItem(itemId)
    if (item.userId !== userId) {
      throw new AppError('ForbiddenError')
    }
    await db.item.delete({
      where: {
        id: itemId,
      },
    })

    algolia.delete(itemId).catch(console.error)
  }

  async countLikes(itemId: number) {
    const count = await db.itemLike.count({
      where: {
        itemId,
      },
    })

    return count
  }

  async updateItemLikes({ itemId, likes }: UpdateItemLikesParams) {
    return db.itemStats.update({
      data: {
        likes,
      },
      where: {
        itemId,
      },
    })
  }

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
  }

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
  }

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
  }

  private async getItemLikedMap(params: GetItemLikedParams) {
    const { userId, itemIds } = params
    const list = await db.itemLike.findMany({
      where: {
        userId,
        itemId: {
          in: itemIds,
        },
      },
    })
    // for find easelly with itemId
    return list.reduce((acc, cur) => {
      acc[cur.itemId] = cur
      return acc
    }, {} as Record<number, ItemLike>)
  }
}

export default ItemService

type GetItemsParams =
  | { mode: 'trending' | 'recent' }
  | { mode: 'past'; date: string }

interface UpdateItemParams {
  itemId: number
  userId: number
  title: string
  body: string
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
