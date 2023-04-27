import { Static, Type } from '@sinclair/typebox'
import { FastifySchema } from 'fastify'
import { Nullable } from '../../../lib/typebox.js'

const CreateItemBody = Type.Object({
  title: Type.String(),
  body: Type.String(),
  link: Type.String(),
  tags: Type.Array(Type.String()),
})

export type CreateItemBodyType = Static<typeof CreateItemBody>

const CreateItemResult = Type.Object({
  id: Type.Number(),
  title: Type.String(),
  body: Type.String(),
  link: Type.String(),
  thumbnail: Nullable(Type.String()),
  createdAt: Type.String(),
  updatedAt: Type.String(),
})

CreateItemResult.example = {
  id: 1,
  title: 'string',
  body: 'string',
  link: 'https://string',
  thumbnail: null,
  createdAt: '2023-04-26T08:28:12.443Z',
  updatedAt: '2023-04-26T08:28:12.443Z',
}

type CreateItemResultType = Static<typeof CreateItemResult>

export const writeItemSchema: FastifySchema = {
  tags: ['item'],
  body: CreateItemBody,
  response: {
    200: CreateItemResult,
  },
}

export interface WriteItemRoute {
  Body: CreateItemBodyType
}
