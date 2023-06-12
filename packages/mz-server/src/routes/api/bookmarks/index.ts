import BookmarkService from '../../../services/BookmarkService.js'
import { createAuthorizedRoute } from '../../../plugins/requireAuthPlugin.js'
import { BookmarkRouteSchema } from './schema.js'

export const bookmarkRoute = createAuthorizedRoute(async (fastify) => {
  const bookmarkService = BookmarkService.getInstance()

  fastify.post(
    '/',
    { schema: BookmarkRouteSchema.CreateBookmark },
    async (request) => {
      const { itemId } = request.body
      const userId = request.user?.id!
      return bookmarkService.createBookmark({
        itemId,
        userId,
      }) as any
    },
  )

  fastify.get(
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
      }) as any
    },
  )

  fastify.delete(
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
})
