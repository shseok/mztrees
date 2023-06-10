import { FastifyPluginAsync } from 'fastify'
import { createAuthorizedRoute } from '../../../plugins/requireAuthPlugin.js'
import ItemService from '../../../services/ItemService.js'
import { commentsRoute } from './comments/index.js'
import { ItemRoute, ItemRouteSchema } from './schema.js'

export const itemsRoute: FastifyPluginAsync = async (fastify) => {
  const itemService = ItemService.getInstance()
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
  fastify.register(authorizedItemRoute(itemService)) // refactoring above code
  fastify.get<ItemRoute['GetItem']>(
    '/:id',
    { schema: ItemRouteSchema.GetItem },
    async (request) => {
      const { id } = request.params
      const item = await itemService.getItem(id, request.user?.id)
      if (item) {
        return item
      }
      return null
    },
  )

  fastify.get<ItemRoute['GetItems']>(
    '/',
    { schema: ItemRouteSchema.GetItems },
    async (request) => {
      const { cursor, mode, startDate, endDate } = request.query
      return itemService.getItems({
        mode: mode ?? 'recent',
        cursor: cursor ?? null,
        userId: request.user?.id,
        limit: 20,
        startDate,
        endDate,
      })
    },
  )

  fastify.register(commentsRoute, { prefix: '/:id/comments' })
}

const authorizedItemRoute = (itemService: ItemService) =>
  createAuthorizedRoute(async (fastify) => {
    // const itemService = ItemService.getInstance()
    fastify.post<ItemRoute['WriteItem']>(
      '/',
      { schema: ItemRouteSchema.WriteItem },
      async (request) => {
        const item = await itemService.createItem(
          request.user!.id, // authorizedItemRoute때문에 무조건 존재 => !
          request.body,
        )
        return item
      },
    )

    fastify.patch<ItemRoute['UpdateItem']>(
      '/:id',
      { schema: ItemRouteSchema.UpdateItem },
      async (request) => {
        const { id: itemId } = request.params
        const userId = request.user!.id
        const { title, body } = request.body
        return itemService.updateItem({ userId, itemId, title, body })
      },
    )

    fastify.delete<ItemRoute['DeleteItem']>(
      '/:id',
      { schema: ItemRouteSchema.DeleteItem },
      async (request, reply) => {
        const { id: itemId } = request.params
        const userId = request.user!.id
        await itemService.deleteItem({ userId, itemId })
        reply.status(204)
      },
    )

    fastify.post<ItemRoute['LikeItem']>(
      '/:id/likes',
      { schema: ItemRouteSchema.LikeItem },
      async (request) => {
        const { id: itemId } = request.params
        const userId = request.user!.id
        const itemStats = await itemService.likeItem({ userId, itemId })
        return { id: itemId, itemStats, isLiked: true }
      },
    )

    fastify.delete<ItemRoute['UnlikeItem']>(
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
