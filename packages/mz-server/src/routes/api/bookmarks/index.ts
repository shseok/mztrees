import { FastifyPluginAsync } from 'fastify'
import BookmarkService from '../../../services/BookmarkService.js'
import { createAuthorizedRoute } from '../../../plugins/requireAuthPlugin.js'
import { BookmarkRoute, BookmarkRouteSchema } from './schema.js'

export const bookmarkRoute: FastifyPluginAsync = createAuthorizedRoute(
  async (fastify) => {
    const bookmarkService = BookmarkService.getInstance()

    fastify.post<BookmarkRoute['CreateBookmark']>(
      '/',
      { schema: BookmarkRouteSchema.CreateBookmark },
      async (request) => {
        console.log(request.body)
        const { itemId } = request.body
        const userId = request.user?.id!
        return bookmarkService.createBookmark({
          itemId,
          userId,
        })
      },
    )

    fastify.get<BookmarkRoute['GetBookmarks']>(
      '/',
      {
        schema: BookmarkRouteSchema.GetBookmarks,
      },
      async (request) => {
        const userId = request.user?.id!
        return bookmarkService.getBookmarks({
          userId,
          limit: 5,
          cursor: request.query.cursor,
        })
      },
    )

    fastify.delete<BookmarkRoute['DeleteBookmark']>(
      '/',
      {
        schema: BookmarkRouteSchema.DeleteBookmark,
      },
      async (request, reply) => {
        const { itemId } = request.query
        const userId = request.user?.id!
        bookmarkService.deleteBookmark({ userId, itemId })
        reply.status(204)
      },
    )
  },
)
