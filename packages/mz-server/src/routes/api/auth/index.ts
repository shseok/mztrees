import { FastifyPluginAsync } from 'fastify'
import UserService from '../../../services/UserService.js'
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  AuthBodyType,
} from './schema.js'
import AppError from '../../../lib/AppError.js'
import { clearTokenCookie, setTokenCookie } from '../../../lib/cookies.js'

const authRoute: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance()
  fastify.post<{ Body: AuthBodyType }>(
    '/login',
    {
      schema: loginSchema,
    },
    // path: '/' > api 전역적으로 쿠키 유효(authPlugin에서도 쿠키를 읽어야하므로)
    // 브라우저에서 전역으로 사용 가능 > 브라우저에서 서버로 쿠키를 보내면 이를 전역적으로 사용 === api 전역적 쿠키 유효
    async (request, reply) => {
      const authResult = await userService.login(request.body)
      setTokenCookie(reply, authResult.tokens)
      return authResult
    },
  )

  fastify.post<{ Body: AuthBodyType }>(
    '/register',
    { schema: registerSchema },
    async (request, reply) => {
      const authResult = await userService.register(request.body)
      setTokenCookie(reply, authResult.tokens)
      return authResult
    },
  )

  fastify.post<{ Body: { refreshToken?: string } }>(
    '/refresh',
    { schema: refreshTokenSchema },
    async (request, reply) => {
      const refreshToken =
        request.body.refreshToken ?? request.cookies.refresh_token ?? ''
      if (!refreshToken) {
        throw new AppError('BadRequestError')
      }
      const tokens = await userService.refreshToken(refreshToken)
      setTokenCookie(reply, tokens)
      return tokens
    },
  )

  fastify.post('/logout', async (request, reply) => {
    clearTokenCookie(reply)
    reply.status(204)
    // return { message: 'logout success' }
  })
}

export default authRoute
