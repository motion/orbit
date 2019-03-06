import { useModel } from '@mcro/bridge'
import { AppBit, AppModel } from '@mcro/models'
import { FindOptions } from 'typeorm'

export function useAppState(args: FindOptions<AppBit> = {}) {
  return useModel(AppModel, args)
}
