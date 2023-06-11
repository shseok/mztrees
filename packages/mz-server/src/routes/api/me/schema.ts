import { FastifySchema } from 'fastify'
import { UserSchema } from '../../../schema/UserSchema.js'
import { createAppErrorSchema } from '../../../lib/AppError.js'
import { RoutesType, createRouteSchema } from '../../../lib/routeSchema.js'
import { Type } from '@sinclair/typebox'

const UnAuthroizedErrorSchema = createAppErrorSchema(
  {
    name: 'UnauthorizedError',
    message: 'Unauthorized error',
    statusCode: 401,
    payload: {
      isExpiredToken: true,
    },
  },
  Type.Object({ isExpiredToken: Type.Boolean() }),
)

export const MeRouteSchema = createRouteSchema({
  GetAccount: {
    tags: ['me'],
    response: {
      200: UserSchema,
      401: UnAuthroizedErrorSchema,
    },
  },
  UpdatePassword: {
    tags: ['me'],
    body: Type.Object({
      oldPassword: Type.String(),
      newPassword: Type.String(),
    }),
    response: {
      204: Type.Null(),
      401: UnAuthroizedErrorSchema,
      403: createAppErrorSchema({
        name: 'Forbidden',
        message: 'Password does not match',
        statusCode: 403,
      }),
      400: createAppErrorSchema({
        name: 'BadRequest',
        message: 'Password is invalid',
        statusCode: 400,
      }),
    },
  },
  Unregister: {
    tags: ['me'],
    response: {
      204: Type.Null(),
    },
  },
})
export type MeRoute = RoutesType<typeof MeRouteSchema>
