import Fastify, {FastifyInstance} from 'fastify';

const server: FastifyInstance = Fastify({})


server.get('/ping', async () => {
    return 'hellosdfsdf';
});

const start = async () => {
    try {
        await server.listen({port: 4000});
    } catch (err) {
        server.log.error(err);
    }
}

start();