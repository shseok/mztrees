import { FastifyPluginAsync } from 'fastify'
import UserService from '../../../services/UserService.js'
import { loginSchema, registerSchema } from './schema.js'
import { AuthBody } from './types.js'

const authRoute: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance()
  fastify.post<{ Body: AuthBody }>(
    '/login',
    {
      schema: loginSchema,
    },
    // path: '/' > api 전역적으로 쿠키 유효(authPlugin에서도 쿠키를 읽어야하므로)
    // 브라우저에서 전역으로 사용 가능 > 브라우저에서 서버로 쿠키를 보내면 이를 전역적으로 사용 === api 전역적 쿠키 유효
    async (request, reply) => {
      const authResult = await userService.login(request.body)
      reply.setCookie('access_token', authResult.tokens.accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60),
        path: '/',
      })
      reply.setCookie('refresh_token', authResult.tokens.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        path: '/',
      })
      return authResult
    },
  )

  fastify.post<{ Body: AuthBody }>(
    '/register',
    { schema: registerSchema },
    async (request) => {
      const authResult = await userService.register(request.body)
      return authResult
    },
  )
}

export default authRoute
