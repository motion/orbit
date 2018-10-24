import { observeOne, save } from '@mcro/model-bridge'
import { SettingModel, GeneralSetting, GeneralSettingValues } from '@mcro/models'

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

  update = async (values: Partial<GeneralSettingValues>) => {
    this.setting.values = {
      ...this.setting.values,
      ...values,
    }
    await save(SettingModel, this.setting)
  }

  willUnmount() {
    this.setting$.unsubscribe()
  }
}
