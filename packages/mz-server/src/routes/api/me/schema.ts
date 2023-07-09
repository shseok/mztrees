import { UserSchema } from '../../../schema/UserSchema.js'
import { createAppErrorSchema } from '../../../lib/AppError.js'
import { createRouteSchema } from '../../../lib/routeSchema.js'
import { Type } from '@fastify/type-provider-typebox'

const UnAuthroizedErrorSchema = createAppErrorSchema(
  'Unauthorized',
  {
    isExpiredToken: true,
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
      403: createAppErrorSchema('Forbidden'), //Password does not match
      400: createAppErrorSchema('BadRequest'), //Password is invalid
    },
  },
  Unregister: {
    tags: ['me'],
    response: {
      204: Type.Null(),
    },
  },
})
