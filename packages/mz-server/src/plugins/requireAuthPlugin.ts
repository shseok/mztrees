import fp from 'fastify-plugin'
import AppError from '../lib/AppError.js'
import { FastifyPluginAsyncTypebox } from '../lib/types.js'

// 인증 라우트를 위한 플러그인 정의
const requireAuthPluginAsync: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.addHook('preHandler', async (request, reply) => {
    // console.log(request.user, request.isExpiredToken, request.cookies)
    // console.log(request)
    // 토큰 만료시 리뉴 작업을 클라에서 요청하도록 로직 구성하기
    if (request.isExpiredToken) {
      throw new AppError('Unauthorized', {
        isExpiredToken: true,
      })
    }

    // 로그인 중이면 유저정보를 준다.
    // 그렇지않으면, 오류를 출력한다.
    if (!request.user) {
      throw new AppError('Unauthorized', {
        isExpiredToken: false,
      })
    }
  })
}

const requireAuthPlugin = fp(requireAuthPluginAsync, {
  name: 'requireAuthPlugin',
})

export function createAuthorizedRoute(plugin: FastifyPluginAsyncTypebox) {
  const wrappedPlugin: FastifyPluginAsyncTypebox = async (fastify, opts) => {
    fastify.register(requireAuthPlugin)
    return plugin(fastify, opts)
  }
  return wrappedPlugin
}

export default requireAuthPlugin
