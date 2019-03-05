import { hash } from '@mcro/utils'
import { AppBit, Bit } from '@mcro/models'

const createDOMPurify = require('dompurify')
const JSDOM = require('jsdom').JSDOM

/**
 * Common Bit utility functions.
 */
export class BitUtils {

  /**
   * Returns missing elements of the first bits based on given list of second bits.
   */
  static difference<T extends Bit>(firstBits: T[], secondBits: T[]): T[] {
    return firstBits.filter(firstBit => {
      return !secondBits.some(secondBit => {
        return firstBit.id === secondBit.id
      })
    })
  }

  /**
   * Creates a content hash for a given bit.
   */
  static contentHash(bit: Bit): number {
    return hash(
      [
        bit.id,
        bit.appId,
        bit.app ? bit.app.id : bit.appId,
        bit.title,
        bit.body,
        bit.type,
        bit.webLink,
        bit.desktopLink,
        bit.data,
        bit.location,
        bit.bitCreatedAt,
        bit.bitUpdatedAt,
        bit.authorId,
      ].filter(item => item !== null && item !== undefined),
    )
  }
}

/**
 * Strips HTML from the given HTML text content.
 */
export function stripHtml(value: string) {
  if (!value) return ''

  const window = new JSDOM('').window
  const DOMPurify = createDOMPurify(window)
  return DOMPurify.sanitize(value, { ALLOWED_TAGS: [] })
    .replace(/&nbsp;/gi, ' ')
    .replace(/•/gi, '')
    .trim()
}

/**
 * Sanitizes given HTML text content.
 */
export function sanitizeHtml(value: string) {
  if (!value) return ''

  const window = new JSDOM('').window
  const DOMPurify = createDOMPurify(window)
  return DOMPurify.sanitize(value).trim()
}


/**
 * Creates a bit id.
 */
export function generateBitId(App: string, appId: number | undefined, data: string): number

/**
 * Creates a bit id.
 */
export function generateBitId(app: AppBit, data: string): number

/**
 * Creates a bit id.
 */
export function generateBitId(bitOrBitType: AppBit | string, appIdOrData: any, maybeData?: string): number {
  if (typeof bitOrBitType === 'object') {
    // App
    return hash(`${bitOrBitType.identifier}-${bitOrBitType.id}-${appIdOrData}`)
  } else if (bitOrBitType && appIdOrData && maybeData) {
    return hash(`${bitOrBitType}-${appIdOrData}-${maybeData}`)
  } else if (bitOrBitType && !appIdOrData) {
    return hash(`${bitOrBitType}-${maybeData}`)
  }
  return 0
}

/**
 * Creates a new bit and sets given properties to it.
 */
export function createBit(properties: Partial<Bit>, appId?: any) {
  const bit: Bit = { target: 'bit', ...properties }
  bit.contentHash = this.contentHash(bit)
  if (!bit.appId && bit.app) bit.appId = bit.app.id
  if (bit.appIdentifier && bit.appId && appId) {
    bit.id = this.id(bit.appIdentifier, bit.appId, appId)
  }
  return bit
}
