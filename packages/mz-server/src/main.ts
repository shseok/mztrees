import Fastify, { FastifyInstance } from 'fastify'
import routes from './routes/index.js'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { swaggerConfig, swaggerUiConfig } from './config/swagger.js'
import AppError from './lib/AppError.js'
import 'dotenv/config'
import { authPlugin } from './plugins/authPlugin.js'
import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'

const server: FastifyInstance = Fastify({
  logger: true,
})

server.register(cors, {
  origin: [
    'http://localhost:4000',
    'http://127.0.0.1:5173',
    'http://localhost:5173',
  ],
  credentials: true,
  allowedHeaders: ['Cookie', 'Content-Type'],
  // exposedHeaders: ['Set-Cookie'],
})

await server.register(fastifySwagger, swaggerConfig)
await server.register(fastifySwaggerUi, swaggerUiConfig)

server.register(fastifyCookie)

server.setErrorHandler(async (error, request, reply) => {
  // reply.statusCode는 기본적으로 200이기 때문
  reply.statusCode = error.statusCode ?? 500
  if (error instanceof AppError) {
    return {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
      payload: error.payload,
    }
  }
  return error
})

server.register(authPlugin)
server.register(routes)

const start = async () => {
  try {
    await server.listen({ port: 4000 })
  } catch (err) {
    server.log.error(err)
  }
}

start()
