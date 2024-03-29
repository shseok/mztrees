import userService from '../../../services/user.service.js'
import AppError from '../../../lib/AppError.js'
import { clearTokenCookie, setTokenCookie } from '../../../lib/cookies.js'
import { AuthRouteSchema } from './schema.js'
import { FastifyPluginAsyncTypebox } from '../../../lib/types.js'

const authRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    '/login',
    {
      schema: AuthRouteSchema.Login,
    },
    // path: '/' > api 전역적으로 쿠키 유효(authPlugin에서도 쿠키를 읽어야하므로)
    // 브라우저에서 전역으로 사용 가능 > 브라우저에서 서버로 쿠키를 보내면 이를 전역적으로 사용 === api 전역적 쿠키 유효
    async (request, reply) => {
      const authResult = await userService.login(request.body)
      setTokenCookie(reply, authResult.tokens)
      return authResult
    },
  )

  fastify.post(
    '/register',
    { schema: AuthRouteSchema.Register },
    async (request, reply) => {
      const authResult = await userService.register(request.body)
      setTokenCookie(reply, authResult.tokens)
      return authResult
    },
  )

  fastify.post(
    '/refresh',
    { schema: AuthRouteSchema.RefreshToken },
    async (request, reply) => {
      // console.log(
      //   'headers',
      //   request.headers,
      //   'body',
      //   request.body,
      //   'cookies',
      //   request.cookies,
      // )
      const refreshToken =
        request.body.refreshToken ?? request.cookies.refresh_token ?? ''
      if (!refreshToken) {
        throw new AppError('BadRequest')
      }
      const tokens = await userService.refreshToken(refreshToken)
      setTokenCookie(reply, tokens)
      return tokens
    },
  )

  fastify.post(
    '/logout',
    { schema: AuthRouteSchema.Logout },
    async (_, reply) => {
      clearTokenCookie(reply)
      reply.status(204)
      // return { message: 'logout success' }
    },
  )
}

export default authRoute
