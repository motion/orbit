import { Bit } from '@mcro/models'
import { BitEntity } from '../entities/BitEntity'

/**
 * Bit-related utilities.
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
   * Creates a new bit and sets given properties to it.
   */
  static create(properties: Partial<Bit>) {
    const bit = Object.assign(new BitEntity(), properties)
    bit.contentHash = this.contentHash(bit)
    return bit
  }

  /**
   * Creates a content hash for a given bit.
   */
  static contentHash(bit: Bit): number {
    return this.hash([
      bit.id,
      bit.integration,
      bit.settingId,
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
    ].filter(item => item !== null && item !== undefined))
  }

  /**
   * Generates a hash number for a given object.
   * Make sure given object does not have circular structure.
   *
   * @see https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
   */
  private static hash(value: any): number {
    const str = JSON.stringify(value)
    let hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
}
