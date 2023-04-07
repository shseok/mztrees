import {FastifySchema} from "fastify/types/schema";

export const registerSchema: FastifySchema = {
    body: {
        type: 'object',
        properties: {
            username: {type: 'string'},
            password: {type: 'string'},
        }
    },
    response:{
        200: {
            description: 'Successful response',
            type: 'object',
            properties: {
                token: { type: 'string' }
            },
            example: {
                token: 'hello world',
            }

        }
    }
}

export const loginSchema: FastifySchema = {
    body: {
        type: 'object',
        properties: {
            username: {type: 'string'},
            password: {type: 'string'},
        }
    }
}