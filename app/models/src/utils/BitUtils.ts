import { hash } from '@mcro/utils'
import { SlackBitData } from '../bit-data/SlackBitData'
import { AppBit, AppIdentifier } from '../interfaces/AppBit'
import { Bit } from '../interfaces/Bit'

/**
 * Common Bit utility functions.
 */
export class BitUtils {
  /**
   * Creates a bit id.
   */
  static id(App: AppIdentifier, appId: number | undefined, data: string): number
  static id(app: AppBit, data: string): number
  static id(bitOrBitType: AppBit | AppIdentifier, appIdOrData: any, maybeData?: string): number {
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
   * Creates a new bit and sets given properties to it.
   */
  static create(properties: Partial<Bit>, AppId?: any) {
    const bit: Bit = { target: 'bit', ...properties }
    bit.contentHash = this.contentHash(bit)
    if (!bit.appId && bit.app) bit.appId = bit.app.id
    if (bit.appIdentifier && bit.appId && AppId) {
      bit.id = this.id(bit.appIdentifier, bit.appId, AppId)
    }
    return bit
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

  // TODO could return title/body separately when improving search
  static getSearchableText(bit: Bit): string {
    if (bit.type === 'conversation') {
      // TODO make a generic conversation bit data type
      const data = bit.data as SlackBitData
      return data.messages
        .map(x => `${x.user} ${x.text}`)
        .join(' ')
        .trim()
    }
    return `${bit.title} ${bit.body}`.trim()
  }
}
