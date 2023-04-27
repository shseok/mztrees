import { FastifyPluginAsync } from 'fastify'
import { WriteItemRoute, writeItemSchema } from './schema.js'
import { createAuthorizedRoute } from '../../../plugins/requireAuthPlugin.js'
import ItemService from '../../../services/ItemService.js'

export const itemsRoute: FastifyPluginAsync = async (fastify) => {
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

  fastify.get('/', async () => {
    return { hello: 'world' }
  })
}

const authorizedItemRoute = createAuthorizedRoute(async (fastify) => {
  const itemService = ItemService.getInstance()
  fastify.post<WriteItemRoute>(
    '/',
    { schema: writeItemSchema },
    async (request) => {
      const item = await itemService.createItem(request.user!.id, request.body)
      return item
    },
  )
})
