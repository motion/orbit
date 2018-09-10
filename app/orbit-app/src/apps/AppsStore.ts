import { SettingModel, Setting } from '@mcro/models'
import { getSettingTitle } from '../helpers/toAppConfig/settingToAppConfig'
import { observeMany } from '../repositories'
import { react, ensure } from '@mcro/black'
import { allServices } from '../stores/helpers/appStoreHelpers'

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

  services = react(
    () => this.appsList,
    settings => {
      ensure('has settings', !!settings)
      const services = {}
      for (const setting of settings) {
        const { type } = setting
        if (!setting.token) {
          continue
        }
        if (allServices[type]) {
          const ServiceConstructor = allServices[type]()
          services[type] = new ServiceConstructor(setting)
        } else {
          console.warn('no service for', type, allServices)
        }
      }
      return services
    },
  )

  willUnmount() {
    this.appsList$.unsubscribe()
  }

  getTitle = getSettingTitle
}
