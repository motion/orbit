import { useModel } from '@mcro/bridge'
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
