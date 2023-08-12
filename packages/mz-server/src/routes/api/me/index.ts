import requireAuthPlugin from '../../../plugins/requireAuthPlugin.js'
import { MeRouteSchema } from './schema.js'
import userService from '../../../services/user.service.js'
import { clearTokenCookie } from '../../../lib/cookies.js'
import { FastifyPluginAsyncTypebox } from '../../../lib/types.js'

export const meRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.register(requireAuthPlugin)
  fastify.get('/', { schema: MeRouteSchema.GetAccount }, async (request) => {
    return request.user!
  })

  fastify.post(
    '/change-password',
    { schema: MeRouteSchema.UpdatePassword },
    async (request, reply) => {
      const { oldPassword, newPassword } = request.body
      await userService.changePassword({
        userId: request.user?.id!,
        oldPassword,
        newPassword,
      })
      reply.status(204)
    },
  )

  fastify.delete(
    '/',
    { schema: MeRouteSchema.Unregister },
    async (request, reply) => {
      await userService.unregister(request.user?.id!)
      reply.status(204)
      clearTokenCookie(reply)
    },
  )
}
