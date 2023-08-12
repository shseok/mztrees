import AppError from '../lib/AppError.js'
import db from '../lib/db.js'
import itemService from './item.service.js'

const bookmarkService = {
  async createBookmark({ userId, itemId }: { userId: number; itemId: number }) {
    // 중복으로 인해 오류가 날 수 있다.
    // 중복 요청에 대한 오류 처리 > 나중에 중복해서 만드는 시도를 해서 그때 어떤 오류가 나오는지 봐서 try catch를 해줄 것이다.
    try {
      const bookmark = await db.bookmark.create({
        data: {
          userId,
          itemId,
        },
        include: {
          item: {
            include: {
              user: true,
              publisher: true,
              itemStats: true,
              itemLikes: { where: { userId } },
            },
          },
        },
      })
      return {
        ...bookmark,
        item: { ...itemService.serialize(bookmark.item), isBookmarked: true },
      }
    } catch (e) {
      if ((e as any)?.message?.includes('Unique constraint failed')) {
        throw new AppError('AlreadyExists')
      }
      throw e
    }
  },

  async getBookmarks({
    userId,
    limit,
    cursor,
  }: {
    userId: number
    limit: number
    cursor?: number | null
  }) {
    // 우선 시리얼라이징 x 상태로 보낸다. for 데이터가 잘 만들어졌는지 확인용
    // response 에 스키마작성하고 그에 대하여 시리얼라이징하기
    const totalCount = await db.bookmark.count({
      where: {
        userId,
      },
    })

    const cursorBookmark = cursor
      ? await db.bookmark.findUnique({ where: { id: cursor } })
      : null
    const bookmarks = await db.bookmark.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        userId,
        createdAt: cursorBookmark
          ? {
              lt: cursorBookmark.createdAt,
            }
          : undefined,
      },
      include: {
        item: {
          include: {
            user: true,
            publisher: true,
            itemStats: true,
            itemLikes: { where: { userId } },
          },
        },
      },
      take: limit,
    })
    const list = bookmarks.map((b) => ({
      ...b,
      item: { ...itemService.serialize(b.item), isBookmarked: true },
    }))

    const endCursor = list.at(-1)?.id ?? null
    const hasNextPage = endCursor
      ? (await db.bookmark.count({
          where: { userId, createdAt: { lt: list.at(-1)?.createdAt } },
        })) > 0
      : false
    return { totalCount, list, pageInfo: { endCursor, hasNextPage } }
  },

  async deleteBookmark({ userId, itemId }: { userId: number; itemId: number }) {
    const bookmark = await db.bookmark.findUnique({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
    })

    if (!bookmark) {
      throw new AppError('NotFound')
    }

    if (bookmark.userId !== userId) {
      throw new AppError('Forbidden')
    }

    await db.bookmark.delete({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
    })
  },
}

export default bookmarkService
