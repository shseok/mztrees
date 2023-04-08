import { FastifySchema } from 'fastify/types/schema'
import { appErrorSchema } from '../../../lib/AppError.js'

const authResultSchema = {
  description: 'Successful response',
  type: 'object',
  properties: {
    tokens: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
      example: {
        accessToken: 'hello world1',
        refreshToken: 'hello world2',
      },
    },
    user: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        username: { type: 'string' },
      },
      example: {
        id: '1',
        username: 'shs',
      },
    },
  },
}

const authBodySchema = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
  },
}

export const registerSchema: FastifySchema = {
  body: authBodySchema,
  response: {
    200: authResultSchema,
    409: {
      ...appErrorSchema,
      example: {
        name: 'UserExistsError',
        message: 'User already exists',
        statusCode: 409,
      },
    },
  },
}

export const loginSchema: FastifySchema = {
  body: authBodySchema,
  response: {
    200: authResultSchema,
    401: {
      ...appErrorSchema,
      example: {
        name: 'AuthenticationEror',
        message: 'Invalid username or password',
        statusCode: 401,
      },
    },
  },
}
