// 인증 라우트를 위한 플러그인

import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import AppError from '../lib/AppError.js'

const requireAuthPluginAsync: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', async (request, reply) => {
    // console.log(request.user, request.isExpiredToken, request.cookies)
    // console.log(request)
    // 토큰 만료시 리뉴 작업을 클라에서 요청하도록 로직 구성하기
    if (request.isExpiredToken) {
      throw new AppError('UnauthorizedError', {
        isExpiredToken: true,
      })
    }

    // 로그인 중이면 유저정보를 준다.
    // 그렇지않으면, 오류를 출력한다.
    if (!request.user) {
      throw new AppError('UnauthorizedError', {
        isExpiredToken: false,
      })
    }
  })
}

const requireAuthPlugin = fp(requireAuthPluginAsync, {
  name: 'requireAuthPlugin',
})

export default requireAuthPlugin
