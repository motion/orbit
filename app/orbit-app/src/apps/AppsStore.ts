import { SettingModel, Setting } from '@mcro/models'
import { getSettingTitle } from '../helpers/toAppConfig/settingToAppConfig'
import { observeMany } from '@mcro/model-bridge'
import { react, ensure } from '@mcro/black'

export class AppsStore {
  appsList: Setting[] = []

  private appsList$ = observeMany(SettingModel, {
    args: {
      where: {
        token: { $not: '' },
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
