import {FastifyPluginAsync} from "fastify";
import authRoute from "./auth/index.js";

const api: FastifyPluginAsync = async (fastify) => {
    // http://localhost:4000/api/test
    // fastify.get('/test', async () => {
    //     return "it's working"
    // })
    fastify.register(authRoute,{ prefix: '/auth' });
}

export default api;