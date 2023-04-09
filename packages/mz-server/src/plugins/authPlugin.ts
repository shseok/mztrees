// 인증 연동하기 위한 플러그인

import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { AccessTokenPayload, validateToken } from '../lib/token.js'
import jwt from 'jsonwebtoken'

const { JsonWebTokenError } = jwt

const authPluginAsync: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('user', null)
  fastify.decorateRequest('isExpiredToken', false)
  fastify.addHook('preHandler', async (request) => {
    const token =
      request.headers.authorization?.split('Bearer ')[1] ??
      request.cookies.access_token

    if (!token) return

    try {
      const decoded = await validateToken<AccessTokenPayload>(token)
      request.user = {
        id: decoded.userId,
        username: decoded.username,
      }
    } catch (e) {
      // 인증이 필요하지 않은 곳에서도 오류 발생 가능성
      if (e instanceof JsonWebTokenError) {
        if (e.name === 'TokenExpiredError') {
          request.isExpiredToken = true
        }
      }
    }
  })
}

export const authPlugin = fp(authPluginAsync, {
  name: 'authPlugin',
})

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: number
      username: string
    } | null
    isExpiredToken: boolean
  }
}
