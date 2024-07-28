import * as cheerio from 'cheerio'
import { decodeHTML as _decodeHTML } from 'entities'

import type { SemesterType } from './types'

export const $ = (html: string) => cheerio.load(html, { xml: true, decodeEntities: false })

export const parseSemesterType = (n: number) => (['autumn', 'spring', 'summer'][n - 1] || 'unknown') as SemesterType

export const decodeHTML = (html: string) => _decodeHTML(html).replace(/^(\\xC2\\x9E\\xC3\\xA9|(\\x9E)?\\xE9)\\x65/, '')

export function base64ToUtf8(base64Str: string) {
  const binaryStr = atob(base64Str)

  const len = binaryStr.length
  const bytes = new Uint8Array(len)

  for (let i = 0; i < len; i++)
    bytes[i] = binaryStr.charCodeAt(i)

  return new TextDecoder('utf-8').decode(bytes)
}

export function addCSRFTokenToUrl(url: string | URL | Request, token: string): URL {
  if (url instanceof Request)
    url = new URL(url.url)

  if (typeof url === 'string')
    url = new URL(url)

  url.searchParams.set('_csrf', token)
  return url
}
