import { FastifyPluginAsync } from 'fastify'
import authRoute from './auth/index.js'
import { meRoute } from './me/index.js'
import { itemsRoute } from './items/index.js'
import { searchRoute } from './search/index.js'
import { bookmarkRoute } from './bookmarks/index.js'
import { linkRoute } from './link/index.js'

// route 등록
const api: FastifyPluginAsync = async (fastify) => {
  fastify.register(authRoute, { prefix: '/auth' })
  fastify.register(meRoute, { prefix: '/me' })
  fastify.register(itemsRoute, { prefix: '/items' })
  fastify.register(searchRoute, { prefix: '/search' })
  fastify.register(bookmarkRoute, { prefix: '/bookmark' })
  fastify.register(linkRoute, { prefix: '/link' })
}

export default api
