import { observeOne, save } from '@o/bridge'
import { Setting, SettingModel } from '@o/models'
import { react } from '@o/use-store'

export class SettingStore {
  setting: Setting = {
    target: 'setting',
    values: {},
  }

  settingModel = react(() => observeOne(SettingModel, { args: { where: { name: 'general' } } }))

  updateSettingFromModel = react(
    () => this.settingModel,
    next => {
      this.setting = next
    },
  )

  get values() {
    return this.setting.values
  }

  update = async (values: Partial<Setting['values']>) => {
    this.setting.values = {
      ...this.setting.values,
      ...values,
    }
    await save(SettingModel, this.setting)
  }
}
