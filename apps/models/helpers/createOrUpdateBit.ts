import { createOrUpdate, CreateOrUpdateOpts } from './createOrUpdate'
import { Bit } from '../bit'
import Crypto from 'crypto'

export const hash = x =>
  Crypto.createHash('md5')
    .update(x instanceof Object ? JSON.stringify(x) : `${x}`)
    .digest('hex')

export function createOrUpdateBit(
  Model: any,
  values: Object,
  options?: CreateOrUpdateOpts,
) {
  const contentHash = hash(values)
  return createOrUpdate(
    Model,
    {
      ...values,
      contentHash,
    },
    {
      updateIf: found => found.contentHash !== contentHash,
      matching: Bit.identifyingKeys,
      ...options,
    },
  )
}
