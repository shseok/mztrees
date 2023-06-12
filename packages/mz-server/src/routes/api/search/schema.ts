import { Type } from '@fastify/type-provider-typebox'
import { routeSchema } from '../../../lib/routeSchema.js'
import { Nullable } from '../../../lib/typebox.js'
import { PaginationSchema } from '../../../lib/pagination.js'

const SearchQuerySchema = Type.Object({
  q: Type.String(),
  offset: Type.Optional(Type.Integer()),
  limit: Type.Optional(Type.Integer()),
})

const SearchSchema = Type.Object({
  id: Type.Integer(),
  link: Type.String(),
  author: Nullable(Type.String()),
  publisher: Type.Object({
    name: Type.String(),
    favicon: Nullable(Type.String()),
    domain: Type.String(),
  }),
  likes: Type.Integer(),
  title: Type.String(),
  body: Type.String(),
  hightlight: Type.Object({
    title: Type.String(),
    body: Type.String(),
  }),
})
// export const searchSchema:FastifySchema({  => (x) / extends FastifySchema({  => (o)
export const SearchRouteSchema = routeSchema({
  tags: ['search'],
  querystring: SearchQuerySchema,
  response: {
    200: PaginationSchema(SearchSchema),
  },
})
