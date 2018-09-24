import { store, react } from '@mcro/black'
import { Setting, SettingModel } from '@mcro/models'
import { save } from '@mcro/model-bridge'
import produce from 'immer'

@store
export class SettingManager<T extends Setting> {
  setting: T = null
  values: T['values'] = null

  constructor(setting: T) {
    console.log('setting is', setting)
    this.setting = setting
    // copy it onto the store so we get instant mutations in views
    // then we react later and save it to the async model
    this.values = { ...setting.values }
  }

  saveSettingOnValuesUpdate = react(
    () => this.values,
    values => {
      this.setting.values = values
      save(SettingModel, this.setting)
    },
  )

  updateValues(cb) {
    this.values = produce(this.values, cb)
  }

  getValue(key: string) {
    return this.values[key]
  }

  dispose() {
    // @ts-ignore
    this.subscriptions.dispose()
  }
}
