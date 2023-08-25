import { Static, Type } from '@fastify/type-provider-typebox'
import { RoutesType, createRouteSchema } from '../../../lib/routeSchema.js'
import { Nullable } from '../../../lib/typebox.js'
import { UserSchema } from '../../../schema/UserSchema.js'
import { PaginationSchema } from '../../../lib/pagination.js'

const ItemStatsSchema = Type.Object({
  id: Type.Integer(),
  likes: Type.Integer(),
  commentsCount: Type.Integer(),
})

ItemStatsSchema.example = {
  id: 1,
  likes: 10,
  commentsCount: 2,
}

export const ItemSchema = Type.Object({
  id: Type.Integer(),
  title: Type.String(),
  body: Type.String(),
  link: Nullable(Type.String()),
  author: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  user: UserSchema,
  publisher: Type.Object({
    id: Type.Integer(),
    name: Type.String(),
    domain: Type.String(),
    favicon: Nullable(Type.String()),
  }),
  thumbnail: Type.Optional(
    Nullable(
      Type.Object({
        id: Type.Integer(),
        key: Type.String(),
        url: Type.String(),
        ref: Type.String(),
      }),
    ),
  ),
  regionCategory: Type.Object({
    id: Type.Integer(),
    name: Type.String(),
  }),
  area: Type.Object({
    id: Type.Integer(),
    name: Type.String(),
    regionCategoryId: Type.Integer(),
  }),
  itemStats: ItemStatsSchema,
  isLiked: Type.Boolean(),
  isBookmarked: Type.Boolean(),
})

export type ItemType = Static<typeof ItemSchema>

ItemSchema.example = {
  id: 1,
  title: 'string',
  body: 'string',
  link: 'https://string',
  thumbnail: null,
  author: 'Kerala Taylor',
  createdAt: '2023-04-26T08:28:12.443Z',
  updatedAt: '2023-04-26T08:28:12.443Z',
  user: {
    id: 35,
    username: 'gigigi3',
  },
  publisher: {
    id: 4,
    name: 'Medium',
    domain: 'keralataylor.medium.com',
    favicon:
      'https://cdn-static-1.medium.com/_/fp/icons/Medium-Avatar-500x500.svg',
  },
  itemStats: {
    id: 1,
    commentsCount: 2,
  },
  isLiked: true,
}

const ItemLikeSchema = Type.Object({
  id: Type.Integer(),
  itemStats: ItemStatsSchema,
  isLiked: Type.Boolean(),
})

ItemLikeSchema.example = {
  id: 1,
  itemStats: {
    id: 1,
    likes: 1,
  },
  isLiked: true,
}

export const ItemParamsSchema = Type.Object({
  id: Type.Integer(),
})

export type ItemParamsType = Static<typeof ItemParamsSchema>

const ImageUrlsSchame = Type.Object({
  urls: Type.Array(Type.String()),
})

ImageUrlsSchame.example = {
  urls: ['www.mztrees.com', 'image.mztrees.com'],
}

export const ItemRouteSchema = createRouteSchema({
  GetItem: {
    tags: ['item'],
    params: ItemParamsSchema,
    response: {
      200: ItemSchema,
    },
  },
  GetItems: {
    tags: ['item'],
    querystring: Type.Object({
      cursor: Type.Optional(Type.Integer()),
      mode: Type.Optional(
        Type.Union([
          Type.Literal('recent'),
          Type.Literal('trending'),
          Type.Literal('past'),
        ]),
      ),
      regionIdx: Type.Optional(Type.Number()),
      startDate: Type.Optional(Type.String()),
      endDate: Type.Optional(Type.String()),
    }),
    response: {
      200: PaginationSchema(ItemSchema),
    },
  },
  WriteItem: {
    tags: ['item'],
    body: Type.Object({
      title: Type.String(),
      body: Type.String(),
      link: Type.String(),
      thumbnail: Type.Optional(Type.String()),
      regionCategory: Type.String(),
      area: Type.String(),
      tags: Type.Optional(Type.Array(Type.String())),
    }),
    response: {
      200: ItemSchema,
    },
  },
  UpdateItem: {
    tags: ['item'],
    params: ItemParamsSchema,
    body: Type.Object({
      title: Type.String(),
      body: Type.String(),
      link: Type.String(),
      thumbnail: Type.Optional(Type.String()),
      regionCategory: Type.String(),
      area: Type.String(),
      tags: Type.Optional(Type.Array(Type.String())),
    }),
    response: {
      200: ItemSchema,
    },
  },
  DeleteItem: {
    tags: ['item'],
    params: ItemParamsSchema,
    response: {
      204: Type.Null(),
    },
  },
  LikeItem: {
    tags: ['item'],
    params: ItemParamsSchema,
    response: {
      200: ItemLikeSchema,
    },
  },
  UnlikeItem: {
    tags: ['item'],
    params: ItemParamsSchema,
    response: {
      200: ItemLikeSchema,
    },
  },
  GetImageUrls: {
    tags: ['item'],
    body: Type.Object({
      link: Type.String(),
    }),
    response: {
      200: ImageUrlsSchame,
    },
  },
})

export type ItemRoute = RoutesType<typeof ItemRouteSchema>
