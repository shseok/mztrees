import axios from 'axios'
import AppError from '../lib/AppError.js'
import metascraper from 'metascraper'
import descriptionRule from 'metascraper-description'
import imageRule from 'metascraper-image'
import imageService from './image.service.js'
import sharp from 'sharp'
import type { MultipartFile } from '@fastify/multipart'
import { nanoid } from 'nanoid'

export const linkService = {
  async getLinkData(requestUrl: string) {
    try {
      const scraper = metascraper([descriptionRule(), imageRule()])
      const { data } = await axios.get(requestUrl, {
        timeout: 8000,
      })

      // Parse the HTML using regular expressions
      const titleMatch = data.match(/<title>(.*?)<\/title>/)
      const title = titleMatch ? titleMatch[1] : ''
      const { description, image } = await scraper({
        html: data,
        url: requestUrl,
      })

      return {
        success: 1,
        meta: {
          title,
          description,
          image: {
            url: image,
          },
        },
      }
    } catch (error) {
      throw new AppError('InvalidURL', {
        message: 'Invalid href',
      })
    }
  },
  async makeImageUrl({
    buffer,
    extension,
  }: {
    buffer: Buffer
    extension: string
  }) {
    // const { buffer, extension } = await imageService.downloadFile(url)
    let compressedBuffer: Buffer | null = null
    if (extension !== 'gif') {
      compressedBuffer = await sharp(buffer)
        .rotate()
        .jpeg({ mozjpeg: true })
        .toBuffer()
    }

    const key = `public/${nanoid()}.${extension || 'png'}`
    await imageService.uploadFile(key, compressedBuffer ?? buffer)

    return `https://img.mztrees.com/${key}`
  },
  // get File data
  async getImageData(fileData?: MultipartFile) {
    // Check if the file is an image (you might want to implement more robust validation)
    if (!fileData?.mimetype.startsWith('image/')) {
      throw new AppError('InvalidFile', {
        message: 'Invalid file type. Only images are allowed.',
      })
    }
    const buffer = await fileData.toBuffer()
    const url = await this.makeImageUrl({
      buffer,
      extension: fileData.mimetype.split('/')[1],
    })

    return {
      success: 1,
      file: {
        url,
      },
    }
  },
}
