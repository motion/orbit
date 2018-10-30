import { Bit, Source } from '@mcro/models'
import { hash } from '@mcro/utils'

/**
 * Common Bit utility functions.
 */
export class BitUtils {
  /**
   * Creates a bit id.
   */
  static id(source: Source, data: string) {
    return hash(`${source.type}-${source.id}-${data}`)
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
  static create(properties: Partial<Bit>, integrationId?: string | number) {
    const bit: Bit = { target: 'bit', ...properties }
    bit.contentHash = this.contentHash(bit)
    if (!bit.sourceId && bit.source) bit.sourceId = bit.source.id
    if (bit.integration && bit.sourceId && integrationId)
      bit.id = hash(`${bit.integration}-${bit.sourceId}-${integrationId}`)
    return bit
  }

  /**
   * Creates a content hash for a given bit.
   */
  static contentHash(bit: Bit): number {
    return hash(
      [
        bit.id,
        bit.integration,
        bit.source ? bit.source.id : bit.sourceId,
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
