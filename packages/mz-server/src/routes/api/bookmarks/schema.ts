import { Type } from '@fastify/type-provider-typebox'
import { RoutesType, createRouteSchema } from '../../../lib/routeSchema.js'
import { ItemSchema } from '../items/schema.js'
import { PaginationSchema } from '../../../lib/pagination.js'

const BookmarkSchema = Type.Object({
  id: Type.Integer(),
  createdAt: Type.String(),
  item: ItemSchema,
})

export const BookmarkRouteSchema = createRouteSchema({
  CreateBookmark: {
    tags: ['bookmarks'],
    body: Type.Object({ itemId: Type.Integer() }),
    response: {
      200: BookmarkSchema,
    },
  },
  GetBookmarks: {
    tags: ['bookmarks'],
    querystring: Type.Object({ cursor: Type.Optional(Type.Integer()) }),
    response: {
      200: PaginationSchema(BookmarkSchema),
    },
  },
  DeleteBookmark: {
    tags: ['bookmarks'],
    querystring: Type.Object({ itemId: Type.Integer() }),
    response: {
      204: Type.Null(),
    },
  },
})

export type BookmarkRoute = RoutesType<typeof BookmarkRouteSchema>
