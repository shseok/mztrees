import axios from 'axios'
import AppError from '../lib/AppError.js'
import metascraper from 'metascraper'
import descriptionRule from 'metascraper-description'

export const linkService = {
  async getLinkData(requestUrl: string) {
    try {
      const scraper = metascraper([descriptionRule()])
      const { data } = await axios.get(requestUrl, {
        timeout: 8000,
      })

      // Parse the HTML using regular expressions
      const titleMatch = data.match(/<title>(.*?)<\/title>/)
      const title = titleMatch ? titleMatch[1] : ''

      const { description } = await scraper({
        html: data,
        url: requestUrl,
      })

      const imageMatch = data.match(/<meta property="og:image" content="(.*?)"/)
      const imageUrl = imageMatch ? imageMatch[1] : ''

      return {
        success: 1,
        meta: {
          title,
          description,
          image: {
            url: imageUrl,
          },
        },
      }
    } catch (error) {
      throw new AppError('InvalidURL', {
        message: 'Invalid href',
      })
    }
  },
}
