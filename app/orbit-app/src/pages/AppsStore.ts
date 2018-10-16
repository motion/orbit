import { SettingModel, Setting } from '@mcro/models'
import { observeMany } from '@mcro/model-bridge'
import { OrbitApps, getApps } from '../apps'
import { react } from '@mcro/black'

export class AppsStore {
  appsList: Setting[] = []

  apps = react(
    () => this.appsList,
    settings => {
      const res: OrbitApps = {}
      for (const setting of settings) {
        res[setting.type] = getApps[setting.type](setting)
      }
      return res
    },
  )

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
}
