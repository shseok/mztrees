//{ querystring: { q: { type: 'string' } } }

import { Type } from '@sinclair/typebox'
import { RoutesType } from '../../../lib/routeSchema.js'

const SearchQuerySchema = Type.Object({
  q: Type.String(),
})

export const SearchRouteSchema = {
  Search: {
    querystring: SearchQuerySchema,
  },
  // response: {
  //   200:
  // }
}

export type SearchRoute = RoutesType<typeof SearchRouteSchema>
