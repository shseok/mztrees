import axios from 'axios'
import AppError from '../lib/AppError.js'

export const linkService = {
  async getLinkData(requestUrl: string) {
    try {
      const res = await axios.get(requestUrl, {
        timeout: 8000,
      })

      // Parse the HTML using regular expressions
      const titleMatch = res.data.match(/<title>(.*?)<\/title>/)
      const title = titleMatch ? titleMatch[1] : ''

      const descriptionMatch = res.data.match(
        /<meta name="description" content="(.*?)"/,
      )
      const description = descriptionMatch ? descriptionMatch[1] : ''

      const imageMatch = res.data.match(
        /<meta property="og:image" content="(.*?)"/,
      )
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
