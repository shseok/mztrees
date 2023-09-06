import axios from 'axios'
import AppError from './AppError.js'
import metascraper from 'metascraper'
import authRule from 'metascraper-author'
import imageRule from 'metascraper-image'
import publisherRule from 'metascraper-publisher'
import logoRule from 'metascraper-logo-favicon'
import { parse } from 'parse5'
import urlString from 'url'

type ValidateResult = {
  url: string
  html: string
}

interface ExtractPageInfoResult {
  url: string
  publisher: string
  favicon: string | null
  thumbnail: string | null
  author: string | null
  domain: string
}

const client = axios.create({
  timeout: 8000,
})

const scraper = metascraper([
  logoRule(),
  imageRule(),
  publisherRule(),
  authRule(),
])

export async function extractPageInfo(
  url: string,
): Promise<ExtractPageInfoResult> {
  const { url: validatedUrl, html } = await validateUrl(url)
  const data = await scraper({
    html,
    url: validatedUrl,
  })
  const domain = new URL(validatedUrl).hostname

  const processedAuthor = (() => {
    let value = data.author
    if (!value) return null
    const hasBracket = value.includes(')')
    if (hasBracket) {
      const [author] = value.split(')')
      value = author.concat(')')
    }
    if (value.length > 20) return null
    return value
  })()
  // console.log(data, domain)
  return {
    url: validatedUrl,
    publisher: data.publisher ?? domain,
    author: processedAuthor !== data.publisher ? processedAuthor : null,
    favicon: data.logo,
    thumbnail: data.image,
    domain,
  }
}

async function validateUrl(url: string): Promise<ValidateResult> {
  const hasProtocol = /^https?:\/\//.test(url)

  if (hasProtocol) {
    try {
      const { data } = await client.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        },
      })

      return {
        url,
        html: data,
      }
    } catch (error) {
      throw new AppError('InvalidURL', {
        message: `1 ${JSON.stringify(error)}`,
      })
    }
  }

  const withHttp = `http://${url}`
  const withHttps = `https://${url}`
  const [http, https] = await Promise.allSettled([
    client.get(withHttp),
    client.get(withHttps),
  ])

  if (https.status === 'fulfilled') {
    return {
      url: withHttps,
      html: https.value.data,
    }
  }

  if (http.status === 'fulfilled') {
    return {
      url: withHttp,
      html: http.value.data,
    }
  }

  throw new AppError('InvalidURL', {
    message: `2 ${JSON.stringify(withHttp)} ${JSON.stringify(
      withHttps,
    )} ${JSON.stringify(http)} ${JSON.stringify(https)} ${JSON.stringify(
      withHttp,
    )}`,
  })
}

export async function extractImageUrls(url: string) {
  const { url: validatedUrl, html } = await validateUrl(url)
  const parsed = parse(html)
  const urlObject = new URL(validatedUrl)
  const protocol = urlObject.protocol
  const domain = urlObject.hostname

  const images: string[] = []

  function extractImagesFromNode(node: any) {
    if (node.nodeName === 'img' && 'attrs' in node) {
      const srcAttr = node.attrs.find((attr: any) => attr.name === 'src')
      if (srcAttr) {
        // 상대경로 절대경로 파악
        const parsedUrl = urlString.parse(srcAttr.value)
        !parsedUrl.hostname && parsedUrl.pathname?.startsWith('/')
          ? images.push(`${protocol}//${domain}${srcAttr.value}`)
          : images.push(srcAttr.value)
      }
    }

    if ('childNodes' in node) {
      for (const childNode of node.childNodes) {
        extractImagesFromNode(childNode)
      }
    }
  }

  extractImagesFromNode(parsed)

  return images
}
