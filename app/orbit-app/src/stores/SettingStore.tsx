import { observeOne } from '@mcro/model-bridge'
import { SettingModel, GeneralSetting } from '@mcro/models'

export const generalSettingQuery = {
  type: 'general' as 'general',
  category: 'general',
  name: 'general',
}

export class SettingStore {
  setting: GeneralSetting = null

  private setting$ = observeOne(SettingModel, { args: { where: generalSettingQuery } }).subscribe(
    value => {
      this.setting = value as GeneralSetting
    },
  )

  willUnmount() {
    this.setting$.unsubscribe()
  }
}
