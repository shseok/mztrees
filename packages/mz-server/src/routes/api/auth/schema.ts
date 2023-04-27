import { FastifySchema } from 'fastify/types/schema'
import { createAppErrorSchema } from '../../../lib/AppError.js'
import { UserSchema } from '../../../schema/UserSchema.js'
import { Static, Type } from '@sinclair/typebox'

export const AuthBody = Type.Object({
  username: Type.String(),
  password: Type.String(),
})

export type AuthBodyType = Static<typeof AuthBody>

const TokensSchema = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
})

const AuthResult = Type.Object({
  tokens: TokensSchema,
  user: UserSchema,
})

export const registerSchema: FastifySchema = {
  tags: ['auth'],
  body: AuthBody,
  response: {
    200: AuthResult,
    409: createAppErrorSchema({
      name: 'UserExistsError',
      message: 'User already exists',
      statusCode: 409,
    }),
  },
}

export const loginSchema: FastifySchema = {
  tags: ['auth'],
  body: AuthBody,
  response: {
    200: AuthResult,
    401: createAppErrorSchema({
      name: 'AuthenticationError',
      message: 'Invalid username or password',
      statusCode: 401,
    }),
  },
}

const refreshTokenBody = Type.Object({
  refreshToken: Type.String(),
})
export const refreshTokenSchema: FastifySchema = {
  tags: ['auth'],
  body: refreshTokenBody,
  response: {
    200: AuthResult,
    401: createAppErrorSchema({
      name: 'RefreshTokenError',
      message: 'Invalid refresh token',
      statusCode: 401,
    }),
  },
}
