import { useModel } from '@mcro/model-bridge'
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
