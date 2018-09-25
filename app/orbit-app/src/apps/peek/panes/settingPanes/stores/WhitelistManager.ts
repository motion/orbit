import { store, react } from '@mcro/black'
import { SettingModel, GithubSetting, SlackSetting, GmailSetting } from '@mcro/models'
import { save } from '@mcro/model-bridge'
import produce from 'immer'
import { memoize } from 'lodash'

type SettingWithWhiteList = GithubSetting | SlackSetting | GmailSetting

@store
export class WhitelistManager<T extends SettingWithWhiteList> {
  setting: T = null
  values: T['values'] = null

  constructor(setting: T) {
    this.setting = setting
    // copy it onto the store so we get instant mutations in views
    // then we react later and save it to the async model
    this.values = { ...setting.values }
  }

  get isWhitelisting() {
    return !this.setting.values.whitelist
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

  toggleActive = (whitelist: string[]) => {
    this.updateValues(values => {
      if (values.whitelist) {
        // toggle to "sync all"
        values.whitelist = undefined
      } else {
        // toggle away from sync all, set each repository
        values.whitelist = whitelist
      }
    })
  }

  whilistStatusGetter = memoize((id: string) => () => {
    if (!this.values.whitelist) {
      return true
    }
    return this.values.whitelist.indexOf(id) !== -1
  })

  updateWhitelistValueSetter = memoize((id: string, setAll: () => string[]) => () => {
    this.updateValues(values => {
      if (!values.whitelist) {
        values.whitelist = setAll()
      }
      const index = values.whitelist.indexOf(id)
      if (index === -1) {
        values.whitelist.push(id)
      } else {
        values.whitelist.splice(index, 1)
      }
    })
  })

  dispose() {
    // @ts-ignore
    this.subscriptions.dispose()
  }
}
