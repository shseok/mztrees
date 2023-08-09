import AWS from 'aws-sdk'
import axios from 'axios'
import mimeTypes from 'mime-types'
import { nanoid } from 'nanoid'

interface CreateFileKeyParams {
  type: 'item' | 'publisher'
  id: number
  extension: string
}

const {
  CF_ACCOUNT_ID,
  CF_ACCESS_KEY_ID,
  CF_ACCESS_KEY_SECRET,
  PUBLIC_S3_BUCKET_NAME,
} = process.env
const { S3 } = AWS

const r2 = new S3({
  endpoint: `https://${CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  accessKeyId: CF_ACCESS_KEY_ID,
  secretAccessKey: CF_ACCESS_KEY_SECRET,
  signatureVersion: 'v4',
  region: 'auto',
})

export class ImageService {
  private static instance: ImageService
  public static getInstance() {
    if (!ImageService.instance) {
      ImageService.instance = new ImageService()
    }
    return ImageService.instance
  }

  public async listBuckets() {
    return r2.listBuckets().promise()
  }

  async downloadFile(url: string) {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(response.data, 'binary')
    const extension = mimeTypes.extension(response.headers['content-type'])
    return { buffer, extension }
  }

  async uploadFile(key: string, file: Buffer) {
    const mimeType = mimeTypes.lookup(key) || 'image/png'

    if (!PUBLIC_S3_BUCKET_NAME) {
      throw new Error('PUBLIC_S3_BUCKET_NAME is not defined')
    }

    const params = {
      Bucket: PUBLIC_S3_BUCKET_NAME,
      Key: key,
      ContentType: mimeType,
      Body: file,
    }

    return r2.upload(params).promise()
  }

  createFileKey({ type, id, extension }: CreateFileKeyParams) {
    return `${type}/${id}/${nanoid()}.${extension}`
  }
}
