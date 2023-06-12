import algoiasearch from 'algoliasearch'
import { PaginationType } from './pagination.js'
import { Publisher } from '@prisma/client'
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
    { offset = 0, length = 20 }: SearchOption = {},
  ) => {
    const result = await index.search<ItemType>(query, {
      offset,
      length,
    })
    // console.log(result)

    const hasNextPage = offset + length < result.nbHits

    const pagination: PaginationType<(typeof result.hits)[0]> = {
      list: result.hits,
      totalCount: result.nbHits,
      pageInfo: {
        nextOffset: hasNextPage ? offset + length : null,
        hasNextPage,
      },
    }
    return pagination
  },
  sync: (item: ItemSchemaForAlgolia) => {
    return index.saveObject({ ...item, objectID: item.id })
  },
  update: (item: ItemSchemaForAlgolia) => {
    return index.partialUpdateObject({
      objectID: item.id,
      ...item,
    })
  },
  delete: (objectID: number) => {
    return index.deleteObject(objectID.toString())
  },
}

interface SearchOption {
  offset?: number
  length?: number
}

interface ItemSchemaForAlgolia {
  id: number
  title: string
  body: string
  author: string | null
  link: string | null
  thumbnail: string | null
  username: string
  publisher: Publisher
}

export default algolia
