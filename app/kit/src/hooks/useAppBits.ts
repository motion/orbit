import { useModels } from '@o/bridge'
import { Bit, BitModel } from '@o/models'
import { FindOptions } from 'typeorm'

import { useApp } from './useApp'

export function useAppBits(args?: FindOptions<Bit>) {
  const app = useApp()
  return useModels(BitModel, {
    ...args,
    where: {
      appId: app.id,
      ...((args && args.where) || null),
    },
  })
}
