import { Type, Static, TSchema } from '@fastify/type-provider-typebox'
import { Nullable } from './typebox.js'

export const PaginationSchema = <T extends TSchema>(type: T) =>
  Type.Object({
    list: Type.Array(type),
    totalCount: Type.Integer(),
    pageInfo: Type.Object({
      nextOffset: Type.Optional(Nullable(Type.Integer())),
      endCursor: Type.Optional(Nullable(Type.Integer())),
      hasNextPage: Type.Boolean(),
    }),
  })

export interface PaginationType<T> {
  list: T[]
  totalCount: number
  pageInfo: {
    nextOffset?: number | null
    endCursor?: number | null
    hasNextPage: boolean
  }
}

export const PaginationOptionSchema = Type.Object({
  // limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
  limit: Type.Optional(Nullable(Type.Integer())),
  cursor: Type.Optional(Nullable(Type.Integer())),
})

export type PaginationOptionType = Static<typeof PaginationOptionSchema>

// for 스키마 자동완성
export function createPagination<T>(params: PaginationType<T>) {
  return params
}
