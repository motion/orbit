import { useModel } from '../useModel'
import { SettingModel } from '@mcro/models'

export function useSettings() {
  return useModel(
    SettingModel,
    {},
    {
      observe: true,
    },
  )
}
