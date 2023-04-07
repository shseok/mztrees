import Fastify, {FastifyInstance} from 'fastify';
import routes from "./routes/index.js";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import {swaggerConfig, swaggerUiConfig} from "./config/swagger.js";

const server: FastifyInstance = Fastify({
    logger: true,
})

await server.register(fastifySwagger, swaggerConfig);
await server.register(fastifySwaggerUi, swaggerUiConfig);

server.register(routes);

const start = async () => {
    try {
        await server.listen({port: 4000});
    } catch (err) {
        server.log.error(err);
    }
}

start();