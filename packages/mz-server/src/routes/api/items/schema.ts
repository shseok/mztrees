import { Static, Type } from '@sinclair/typebox'
import { FastifySchema } from 'fastify'
import { Nullable } from '../../../lib/typebox.js'
import { UserSchema } from '../../../schema/UserSchema.js'
import { PaginationSchema } from '../../../lib/pagination.js'

// createItems

const CreateItemSchema = Type.Object({
  title: Type.String(),
  body: Type.String(),
  link: Type.String(),
  tags: Type.Array(Type.String()),
})

export type CreateItemBodyType = Static<typeof CreateItemSchema>

const ItemSchema = Type.Object({
  id: Type.Number(),
  title: Type.String(),
  body: Type.String(),
  link: Type.String(),
  thumbnail: Nullable(Type.String()),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  user: UserSchema,
})

ItemSchema.example = {
  id: 1,
  title: 'string',
  body: 'string',
  link: 'https://string',
  thumbnail: null,
  createdAt: '2023-04-26T08:28:12.443Z',
  updatedAt: '2023-04-26T08:28:12.443Z',
  user: {
    id: 35,
    username: 'gigigi3',
  },
}

export const WriteItemSchema: FastifySchema = {
  tags: ['item'],
  body: CreateItemSchema,
  response: {
    200: ItemSchema,
  },
}

export interface WriteItemRoute {
  Body: CreateItemBodyType
}

// getItem

const ReadItemParamsSchema = Type.Object({
  id: Type.Number(),
})

type ReadItemParamsType = Static<typeof ReadItemParamsSchema>

export interface GetItemRoute {
  Params: ReadItemParamsType
}

export const GetItemSchema: FastifySchema = {
  tags: ['item'],
  params: ReadItemParamsSchema,
  response: {
    200: ItemSchema,
  },
}

// getItems

const ReadItemsParamsSchema = Type.Object({
  cursor: Type.Optional(Type.String()),
})

type ReadItemsParamsType = Static<typeof ReadItemsParamsSchema>

export interface GetItemsRoute {
  Querystring: ReadItemsParamsType
}

export const GetItemsSchema: FastifySchema = {
  response: {
    200: PaginationSchema(ItemSchema),
  },
}
