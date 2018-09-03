import { SettingModel } from '@mcro/models'
import { getSettingTitle } from '../helpers/toAppConfig/settingToAppConfig'
import { observeMany } from '../repositories'

export class IntegrationSettingsStore {
  settingsList = []

  didMount() {
    const settings$ = observeMany(SettingModel, {
      args: {
        where: {
          token: { $not: '' },
        },
      },
    }).subscribe(values => {
      this.settingsList = values
    })
    this.subscriptions.add({
      dispose: () => settings$.unsubscribe(),
    })
  }

  get settings() {
    if (!this.settingsList) {
      return null
    }
    return this.settingsList.reduce(
      (acc, cur) => ({ ...acc, [cur.type]: cur }),
      {},
    )
  }

  getTitle = getSettingTitle
}
