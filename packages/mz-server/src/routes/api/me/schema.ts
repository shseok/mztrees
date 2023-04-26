import { FastifySchema } from 'fastify'
import { UserSchema } from '../../../schema/UserSchema.js'
import { createAppErrorSchema } from '../../../lib/AppError.js'

export const getMeSchema: FastifySchema = {
  // get은 body x
  response: {
    200: UserSchema,
    401: createAppErrorSchema(
      {
        name: 'UnauthorizedError',
        message: 'Unauthorized error',
        statusCode: 401,
        payload: {
          isExpiredToken: true,
        },
      },
      {
        type: 'object',
        properties: {
          isExpiredToken: {
            type: 'boolean',
          },
        },
      },
    ),
  },
}
