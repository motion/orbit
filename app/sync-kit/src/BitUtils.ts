import { hash } from '@mcro/utils'
import { AppBit, Bit } from '@mcro/models'

/**
 * Common Bit utility functions.
 */
export class BitUtils {
  /**
   * Creates a bit id.
   */
  static id(App: string, appId: number | undefined, data: string): number
  static id(app: AppBit, data: string): number
  static id(bitOrBitType: AppBit | string, appIdOrData: any, maybeData?: string): number {
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
}
