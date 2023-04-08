import {FastifySchema} from "fastify/types/schema";

const authResultSchema = {
    description: 'Successful response',
    type: 'object',
    properties: {
        tokens: {
            type: 'object',
            properties: {
                accessToken: {type: 'string'},
                refreshToken: {type: 'string'},
            },
            example: {
                accessToken: 'hello world1',
                refreshToken: 'hello world2',
            }
        },
        user: {
            type: 'object',
            properties: {
                id: {type: 'string'},
                username: {type: 'string'},
            },
            example: {
                id: '1',
                username: 'shs',
            }
        }
    }
}

const authBodySchema = {
    type: 'object',
    properties: {
        username: {type: 'string'},
        password: {type: 'string'},
    }
}

export const registerSchema: FastifySchema = {
    body: authBodySchema,
    response:{
        200: authResultSchema
    }
}

export const loginSchema: FastifySchema = {
    body: authBodySchema,
    response:{
        200: authResultSchema
    }
}