import { SettingModel } from '@mcro/models'
import { getSettingTitle } from '../helpers/toAppConfig/settingToAppConfig'
import { observeMany } from '../repositories'

export class IntegrationSettingsStore {
  settingsList = []
  private settingsList$ = observeMany(SettingModel, {
    args: {
      where: {
        token: { $not: '' },
      },
    },
  }).subscribe(values => {
    this.settingsList = values
  })

  willUnmount() {
    this.settingsList$.unsubscribe()
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
