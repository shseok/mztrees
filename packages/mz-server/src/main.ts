import Fastify, { FastifyInstance } from 'fastify'
import routes from './routes/index.js'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { swaggerConfig, swaggerUiConfig } from './config/swagger.js'
import 'dotenv/config'
import { authPlugin } from './plugins/authPlugin.js'
import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import { isAppError } from './lib/AppError.js'
import packageJson from './lib/packageJsonInfo.js'

const server: FastifyInstance = Fastify({
  logger: true,
})

console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === 'development') {
  server.register(cors, {
    origin: /localhost/,
    credentials: true,
    allowedHeaders: ['Cookie', 'Content-Type'],
    // exposedHeaders: ['Set-Cookie'],
  })

  await server.register(fastifySwagger, swaggerConfig)
  await server.register(fastifySwaggerUi, swaggerUiConfig)
} else {
  // production
  server.register(cors, {
    origin: /mztrees.com/,
    allowedHeaders: ['Cookie', 'Content-Type'],
    credentials: true,
  })
}

server.register(fastifyCookie)

server.setErrorHandler(async (error, request, reply) => {
  // Fastify에서는 기본적으로 HTTP 응답 코드로 200 (OK)을 사용하므로
  reply.statusCode = error.statusCode ?? 500
  if (isAppError(error)) {
    return {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
      payload: error.payload,
    }
  }

  if (error.statusCode === 400) {
    return {
      name: 'BadRequest',
      message: error.message,
      statusCode: 400,
    }
  }

  return error
})

server.get('/', async () => {
  return { version: packageJson.version }
})

server.register(authPlugin)
server.register(routes)

const start = async () => {
  try {
    // nextjs에서 개발모드에서 host: '0.0.0.0'설정시 auth에서는 localhost > 다른 요청에서 http://localhost:4000 > BUG
    await server.listen({ port: 8080, host: '0.0.0.0' })
    // await server.listen({ port: 8080, host: 'api.mztrees.com' }); // to
    // await server.listen({ port: 4000 }) // for the server to handle only all requests sent from the client to the api.mztrees.com host
  } catch (err) {
    server.log.error(err)
  }
}

start()
