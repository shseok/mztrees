import { FastifyPluginAsyncTypebox } from '../../../lib/types.js'
import { linkService } from '../../../services/link.service.js'
import { linkRouteSchema } from './schema.js'

export const linkRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get('/', { schema: linkRouteSchema }, async (request) => {
    const { url } = request.query
    const result = (await linkService.getLinkData(
      decodeURIComponent(url),
    )) as any
    return result
  })

  fastify.post(
    '/upload',
    // { schema: linkRouteSchema.GetImageData },
    async (request) => {
      const data = await request.file()
      const result = await linkService.getImageData(data)
      return result
    },
  )
}
