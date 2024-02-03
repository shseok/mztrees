import { routeSchema } from '../../../lib/routeSchema.js'
import { Type } from '@fastify/type-provider-typebox'

export const linkRouteSchema = routeSchema({
  tags: ['link'],
  querystring: Type.Object({
    url: Type.String(),
  }),
  response: {
    200: Type.Object({
      success: Type.Number(),
      meta: Type.Object({
        title: Type.String(),
        description: Type.String(),
        image: Type.Object({
          url: Type.String(),
        }),
      }),
    }),
  },
})
