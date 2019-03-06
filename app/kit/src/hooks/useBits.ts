import { useModels } from '@mcro/bridge'
import { Bit, BitModel } from '@mcro/models'
import { FindOptions } from 'typeorm'

export function useBits(args: FindOptions<Bit> = {}) {
  return useModels(BitModel, args)
}
