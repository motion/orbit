import { isEqual } from '@o/fast-compare'
import { Bit } from '@o/models'
import { stringHash } from '@o/utils'

export * from './newEmptyAppBit'

export const isEqualDebug = (a, b) => {
  for (const key in a) {
    if (!isEqual(a[key], b[key])) {
      console.log('falsy key', key, a[key], b[key])
      return false
    }
  }
  return true
}

/**
 * Creates a content hash for a given bit.
 */
export function bitContentHash(bit: Bit): number {
  return stringHash(
    JSON.stringify(
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
    ),
  )
}
