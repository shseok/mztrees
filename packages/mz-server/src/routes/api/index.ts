import { FastifyPluginAsync } from 'fastify'
import authRoute from './auth/index.js'
import { meRoute } from './me/index.js'

// route 등록
const api: FastifyPluginAsync = async (fastify) => {
  // http://localhost:4000/api/test
  // fastify.get('/test', async () => {
  //     return "it's working"
  // })
  fastify.register(authRoute, { prefix: '/auth' })
  fastify.register(meRoute, { prefix: '/me' })
}

export default api
