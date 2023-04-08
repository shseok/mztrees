import fastify, { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { AccessTokenPayload, validateToken } from '../lib/token.js'
import jwt from 'jsonwebtoken'

const { JsonWebTokenError } = jwt

const authPluginAsync: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('user', null)
  fastify.addHook('preHandler', async (request) => {
    const { authorization } = request.headers
    if (!authorization || !authorization.includes('Bearer')) {
      return
    }
    const token = authorization.split('Bearer ')[1]
    try {
      const decoded = await validateToken<AccessTokenPayload>(token)
      console.log(decoded)
    } catch (e) {
      if (e instanceof JsonWebTokenError) {
        console.log(e.name, e.message)
        if (e.name === 'TokenExpiredError') {
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
    }
  }
}
