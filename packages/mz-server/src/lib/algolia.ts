import algoiasearch from 'algoliasearch'
import { PaginationType } from './pagination.js'
import { ItemType } from '../routes/api/items/schema.js'

const ApplicationID = process.env.ALGOLIA_APP_ID
const AdminAPIKey = process.env.ALGOLIA_ADMIN_KEY

if (!ApplicationID) {
  throw new Error('ALGOLIA_APP_ID is not defined in .env file')
}

if (!AdminAPIKey) {
  throw new Error('ALGOLIA_API_KEY is not defined in .env file')
}

const client = algoiasearch(ApplicationID, AdminAPIKey)

const index = client.initIndex('mz_items')

const algolia = {
  search: async (
    query: string,
    { offset = 0, hitsPerPage = 20 }: SearchOption = {},
  ) => {
    const result = await index.search<ItemType>(query, {
      hitsPerPage,
      offset,
    })

    const pagination: PaginationType<(typeof result.hits)[0]> = {
      list: result.hits,
      totalCount: result.nbHits,
      pageInfo: {
        nextOffset: offset + hitsPerPage,
        hasNextPage: offset + hitsPerPage < result.nbHits,
      },
    }
    return pagination
  },
}

interface SearchOption {
  offset?: number
  hitsPerPage?: number
}

export default algolia
