import { observeOne, save } from '@mcro/model-bridge'
import { SettingModel, Setting } from '@mcro/models'

export class SettingStore {
  setting: Setting = {
    target: 'setting',
    values: {},
  }

  get values() {
    return this.setting.values as Setting['values']
  }

  private setting$ = observeOne(SettingModel, { args: { name: 'general' } }).subscribe(value => {
    if (value) {
      this.setting = value
    }
  })

  update = async (values: Partial<Setting['values']>) => {
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
