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

const ItemParamsSchema = Type.Object({
  id: Type.Number(),
})

type ItemParamsType = Static<typeof ItemParamsSchema>

export interface GetItemRoute {
  Params: ItemParamsType
}

export const GetItemSchema: FastifySchema = {
  tags: ['item'],
  params: ItemParamsSchema,
  response: {
    200: ItemSchema,
  },
}

// getItems

const ItemsParamsSchema = Type.Object({
  cursor: Type.Optional(Type.String()),
})

type ItemsParamsType = Static<typeof ItemsParamsSchema>

export interface GetItemsRoute {
  Querystring: ItemsParamsType
}

export const GetItemsSchema: FastifySchema = {
  tags: ['item'],
  response: {
    200: PaginationSchema(ItemSchema),
  },
}

// updateItem
const UpdateItemBodySchema = Type.Object({
  title: Type.String(),
  body: Type.String(),
  tags: Type.Array(Type.String()),
})

type UpdateItemBodyType = Static<typeof UpdateItemBodySchema>

export interface UpdateItemRoute {
  Params: ItemParamsType
  Body: UpdateItemBodyType
}

export const UpdateItemSchema: FastifySchema = {
  tags: ['item'],
  params: ItemParamsSchema,
  body: UpdateItemBodySchema,
  response: {
    200: ItemSchema,
  },
}

// delete Item
export const DeleteItemSchema: FastifySchema = {
  tags: ['item'],
  params: ItemParamsSchema,
  response: {
    204: Type.Null(),
  },
}

export interface DeleteItemRoute {
  Params: ItemParamsType
}
