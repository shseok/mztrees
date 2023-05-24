import algoiasearch from 'algoliasearch'

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
  search: async (query: string) => {
    const result = await index.search(query, {})
    console.log(result)
    return result
  },
}

export default algolia
