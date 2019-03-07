import { useModels } from '@o/bridge'
import { Bit, BitModel } from '@o/models'
import { FindOptions } from 'typeorm'

export function useBits(args: FindOptions<Bit> = {}) {
  return useModels(BitModel, args)
}
