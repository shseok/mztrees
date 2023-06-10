import { FastifyPluginAsync } from 'fastify'
import requireAuthPlugin from '../../../plugins/requireAuthPlugin.js'
import { MeRoute, MeRouteSchema } from './schema.js'
import UserService from '../../../services/UserService.js'
import { clearTokenCookie } from '../../../lib/cookies.js'

export const meRoute: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance()
  fastify.register(requireAuthPlugin)
  fastify.get<MeRoute['GetAccount']>(
    '/',
    { schema: MeRouteSchema.GetAccount },
    async (request) => {
      return request.user
    },
  )

  fastify.post<MeRoute['UpdatePassword']>(
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

  fastify.delete<MeRoute['Unregister']>(
    '/',
    { schema: MeRouteSchema.Unregister },
    async (request, reply) => {
      await userService.unregister(request.user?.id!)
      reply.status(204)
      clearTokenCookie(reply)
    },
  )
}
