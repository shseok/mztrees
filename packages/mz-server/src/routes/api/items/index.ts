import { FastifyPluginAsync } from 'fastify'
import {
  GetItemRoute,
  GetItemSchema,
  GetItemsRoute,
  GetItemsSchema,
  UpdateItemRoute,
  UpdateItemSchema,
  WriteItemRoute,
  WriteItemSchema,
} from './schema.js'
import { createAuthorizedRoute } from '../../../plugins/requireAuthPlugin.js'
import ItemService from '../../../services/ItemService.js'

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
  fastify.get<GetItemRoute>(
    '/:id',
    { schema: GetItemSchema },
    async (request) => {
      const { id } = request.params
      const item = await itemService.getItem(id)
      if (item) {
        return item
      }
      return null
    },
  )

  fastify.get<GetItemsRoute>(
    '/',
    { schema: GetItemsSchema },
    async (request) => {
      const { cursor } = request.query
      return itemService.getPulicItems({
        mode: 'recent',
        cursor: cursor ? parseInt(cursor, 10) : null,
      })
    },
  )
}

const authorizedItemRoute = (itemService: ItemService) =>
  createAuthorizedRoute(async (fastify) => {
    // const itemService = ItemService.getInstance()
    fastify.post<WriteItemRoute>(
      '/',
      { schema: WriteItemSchema },
      async (request) => {
        const item = await itemService.createItem(
          request.user!.id, // authorizedItemRoute때문에 무조건 존재 => !
          request.body,
        )
        return item
      },
    )

    fastify.patch<UpdateItemRoute>(
      '/:id',
      { schema: UpdateItemSchema },
      async (request) => {
        const { id: itemId } = request.params
        const userId = request.user!.id
        const { title, body } = request.body
        return itemService.updateItem({ userId, itemId, title, body })
      },
    )
  })
