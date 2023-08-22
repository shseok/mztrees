import { createAuthorizedRoute } from '../../../plugins/requireAuthPlugin.js'
import itemService from '../../../services/item.service.js'
import { commentsRoute } from './comments/index.js'
import { ItemRouteSchema } from './schema.js'
import { FastifyPluginAsyncTypebox } from '../../../lib/types.js'

export const itemsRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  // fastify.register(async (fastify) => {
  //   fastify.register(requireAuthPlugin)
  //   fastify.post<WriteItemRoute>(
  //     '/',
  //     { schema: writeItemSchema },
  //     async (request) => {
  //       return null
  //     },
  //   )
  // })
  fastify.register(authorizedItemRoute) // refactoring above code
  fastify.get('/:id', { schema: ItemRouteSchema.GetItem }, async (request) => {
    const { id } = request.params
    const item = await itemService.getItem(id, request.user?.id)
    return item as any
  })
  fastify.get('/', { schema: ItemRouteSchema.GetItems }, async (request) => {
    const { cursor, mode, startDate, endDate } = request.query
    return itemService.getItems({
      mode: mode ?? 'recent',
      cursor: cursor ?? null,
      userId: request.user?.id,
      limit: 20,
      startDate,
      endDate,
    }) as any
  })

  fastify.post(
    '/urls',
    { schema: ItemRouteSchema.GetImageUrls },
    async (request) => {
      const { link } = request.body
      const imageUrls = await itemService.getImageUrls(link)
      return { urls: imageUrls } as any
    },
  )

  fastify.register(commentsRoute, { prefix: '/:id/comments' })
}

const authorizedItemRoute = createAuthorizedRoute(async (fastify) => {
  fastify.post('/', { schema: ItemRouteSchema.WriteItem }, async (request) => {
    const userId = request.user!.id
    const item = await itemService.createItem(
      userId, // authorizedItemRoute때문에 무조건 존재 => !
      request.body,
    )
    return item as any
  })
  fastify.patch(
    '/:id',
    { schema: ItemRouteSchema.UpdateItem },
    async (request) => {
      const { id: itemId } = request.params
      const userId = request.user!.id
      const item = await itemService.updateItem(userId, itemId, request.body)
      return item as any
    },
  )

  fastify.delete(
    '/:id',
    { schema: ItemRouteSchema.DeleteItem },
    async (request, reply) => {
      const { id: itemId } = request.params
      const userId = request.user!.id
      await itemService.deleteItem({ userId, itemId })
      reply.status(204)
    },
  )

  fastify.post(
    '/:id/likes',
    { schema: ItemRouteSchema.LikeItem },
    async (request) => {
      const { id: itemId } = request.params
      const userId = request.user!.id
      const itemStats = await itemService.likeItem({ userId, itemId })
      return { id: itemId, itemStats, isLiked: true }
    },
  )

  fastify.delete(
    '/:id/likes',
    { schema: ItemRouteSchema.UnlikeItem },
    async (request) => {
      const { id: itemId } = request.params
      const userId = request.user!.id
      const itemStats = await itemService.unlikeItem({ userId, itemId })
      return { id: itemId, itemStats, isLiked: false }
    },
  )

  // items/(itemId)/bookmarks/(bookmarkId) 이렇게 해줘도 괜찮겠다
})
