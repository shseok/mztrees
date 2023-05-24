import { FastifyPluginAsync } from 'fastify'
import { SearchRoute, SearchRouteSchema } from './schema.js'
import algolia from '../../../lib/algolia.js'

export const searchRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get<SearchRoute['Search']>(
    '/',
    { schema: SearchRouteSchema.Search },
    async (request) => {
      const { q } = request.query
      const hits = await algolia.search(q)
      return hits
    },
  )
}
