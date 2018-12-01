import { hash } from '@mcro/utils'
import { IntegrationType } from '../interfaces/IntegrationType'
import { Source } from '../interfaces/Source'
import { Bit } from '../interfaces/Bit'

/**
 * Common Bit utility functions.
 */
export class BitUtils {
  /**
   * Creates a bit id.
   */
  static id(integration: IntegrationType, sourceId: number | undefined, data: string): number
  static id(source: Source, data: string): number
  static id(
    integrationOrSource: Source | IntegrationType,
    sourceIdOrData: any,
    maybeData?: string,
  ): number {
    if (typeof integrationOrSource === 'object') {
      // Source
      return hash(`${integrationOrSource.type}-${integrationOrSource.id}-${sourceIdOrData}`)
    } else if (integrationOrSource && sourceIdOrData && maybeData) {
      return hash(`${integrationOrSource}-${sourceIdOrData}-${maybeData}`)
    } else if (integrationOrSource && !sourceIdOrData) {
      return hash(`${integrationOrSource}-${maybeData}`)
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
  static create(properties: Partial<Bit>, integrationId?: any) {
    const bit: Bit = { target: 'bit', ...properties }
    bit.contentHash = this.contentHash(bit)
    if (!bit.sourceId && bit.source) bit.sourceId = bit.source.id
    if (bit.integration && bit.sourceId && integrationId) {
      bit.id = this.id(bit.integration, bit.sourceId, integrationId)
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
