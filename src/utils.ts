import * as cheerio from 'cheerio'
import type { SemesterType } from './types'

export const $ = (html: string) => cheerio.load(html, { xml: true, decodeEntities: false })

export const parseSemesterType = (n: number) => (['autumn', 'spring', 'summer'][n - 1] || 'unknown') as SemesterType

export function base64ToUtf8(base64Str: string) {
  const binaryStr = atob(base64Str)

  const len = binaryStr.length
  const bytes = new Uint8Array(len)

  for (let i = 0; i < len; i++)
    bytes[i] = binaryStr.charCodeAt(i)

  return new TextDecoder('utf-8').decode(bytes)
}
