import { SettingModel, Setting } from '@mcro/models'
import { getSettingTitle } from '../helpers/toAppConfig/settingToAppConfig'
import { observeMany } from '@mcro/model-bridge'

export class AppsStore {
  appsList: Setting[] = []

  private appsList$ = observeMany(SettingModel, {
    args: {
      where: {
        type: { $not: 'general' },
      },
    },
  }).subscribe(values => {
    this.appsList = values
  })

  willUnmount() {
    this.appsList$.unsubscribe()
  }

  getTitle = getSettingTitle
}
