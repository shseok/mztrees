import { FastifyPluginAsync } from 'fastify'
import { getMeSchema } from './schema.js'
import AppError from '../../../lib/AppError.js'

export const meRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', { schema: getMeSchema }, async (request) => {
    // 로그인 중이면 유저정보를 준다.
    // 그렇지않으면, 오류를 출력한다.
    if (!request.user) {
      throw new AppError('UnauthorizedError')
    }

    return request.user
  })
}
