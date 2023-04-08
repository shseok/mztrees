import { FastifySchema } from 'fastify'
import { userSchema } from '../../../schema/UserSchema.js'
import { appErrorSchema, createAppErrorSchema } from '../../../lib/AppError.js'

export const getMeSchema: FastifySchema = {
  // get은 body x
  response: {
    200: userSchema,
    401: createAppErrorSchema({
      name: 'UnauthorizedError',
      message: 'Unauthorized error',
      statusCode: 401,
    }),
  },
}
