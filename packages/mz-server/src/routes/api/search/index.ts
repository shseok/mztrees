import { SearchRouteSchema } from './schema.js'
import algolia from '../../../lib/algolia.js'
import ItemService from '../../../services/ItemService.js'
// import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { FastifyPluginAsyncTypebox } from '../../../lib/types.js'

export const searchRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  const itemService = ItemService.getInstance()

  fastify.get('/', { schema: SearchRouteSchema }, async (request) => {
    const { q, limit, offset } = request.query
    const hits = await algolia.search(q, { length: limit, offset })
    const items = await itemService.getItemsByIds(
      hits.list.map((item) => item.id),
      request.user?.id,
    )
    // console.log(items)
    // TODO: move to search service (class -> object)
    // 데이터베이스에서 작업을 하기 위해 service에서 해왔지만, 검색은 데이터베이스가 아닌곳에 추가적인 로직이 있으므로 service에서 구현하는게 맞는가?라는 의미
    // 하지만, service를 만들면 좋긴하겠다. 그렇게한다면 serchService에서 함수만 호출하면 되기때문.
    // 그리고 이전에 service를 모두 class로 만들었는데 객체로 만들어도 괜찮을 것 같다.

    const serializedList = hits.list
      .filter((item) => items[item.id]) // list에 null이 있으면 이상하므로 필터
      .map((hit) => {
        const item = items[hit.id]
        // db에서 어쩌다 삭제되었던 것이 검색엔진에는 데이터가 남아있을 수 있는 경우 > return null을 해주었지만 취소
        return {
          id: item.id,
          link: item.link!,
          author: item.author === '' ? null : item.author,
          publisher: item.publisher,
          likes: item.itemStats?.likes ?? 0,
          title: item.title,
          body: item.body,
          hightlight: {
            title: hit._highlightResult?.title?.value ?? '',
            body: (hit._highlightResult?.body?.value ?? '') as string,
          },
        }
      })
    console.log(serializedList)
    return { ...hits, list: serializedList }
  })
}
