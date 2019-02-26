import { hash } from '@mcro/utils'
import { SlackBitData } from '../bit-data/SlackBitData'
import { Bit } from '../interfaces/Bit'
import { Source } from '../interfaces/Source'
import { SourceType } from '../interfaces/SourceType'

/**
 * Common Bit utility functions.
 */
export class BitUtils {
  /**
   * Creates a bit id.
   */
  static id(Source: SourceType, sourceId: number | undefined, data: string): number
  static id(source: Source, data: string): number
  static id(SourceOrSource: Source | SourceType, sourceIdOrData: any, maybeData?: string): number {
    if (typeof SourceOrSource === 'object') {
      // Source
      return hash(`${SourceOrSource.type}-${SourceOrSource.id}-${sourceIdOrData}`)
    } else if (SourceOrSource && sourceIdOrData && maybeData) {
      return hash(`${SourceOrSource}-${sourceIdOrData}-${maybeData}`)
    } else if (SourceOrSource && !sourceIdOrData) {
      return hash(`${SourceOrSource}-${maybeData}`)
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
  static create(properties: Partial<Bit>, SourceId?: any) {
    const bit: Bit = { target: 'bit', ...properties }
    bit.contentHash = this.contentHash(bit)
    if (!bit.sourceId && bit.source) bit.sourceId = bit.source.id
    if (bit.sourceType && bit.sourceId && SourceId) {
      bit.id = this.id(bit.sourceType, bit.sourceId, SourceId)
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
        bit.sourceType,
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
