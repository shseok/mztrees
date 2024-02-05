import Fastify, { FastifyInstance } from 'fastify'
import routes from './routes/index.js'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { swaggerConfig, swaggerUiConfig } from './config/swagger.js'
import 'dotenv/config'
import { authPlugin } from './plugins/authPlugin.js'
import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
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
server.register(multipart)

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
    // nextjs 개발모드에서 http://127.0.0.1:8080로 보내야 서버컴포넌트에서 에러 발생 x, localhost:8080 or 0.0.0.0:8080으로 보낼시 에러 발생.
    // 만약 host: '0.0.0.0'을 제거한다면 localhost:8080으로 보낼 때, 에러 발생 x
    // await server.listen({ port: 8080, host: 'api.mztrees.com' }); // to
    if (process.env.NODE_ENV === 'development') {
      await server.listen({ port: 8080 }) // for the server to handle only all requests sent from the client to the api.mztrees.com host
    } else {
      await server.listen({ port: 8080, host: '0.0.0.0' })
    }
  } catch (err) {
    server.log.error(err)
  }
}

start()
