import { SettingModel, Setting } from '@mcro/models'
import { observeMany } from '@mcro/model-bridge'
import { getApps } from '../apps'
import { react } from '@mcro/black'
import { OrbitApp } from '../apps/types'

export class AppsStore {
  settingsList: Setting[] = []

  allApps = Object.keys(getApps).map(key => getApps[key]({}))

  activeApps = react(
    () => this.settingsList,
    appsList => {
      return appsList.map(setting => getApps[setting.type](setting) as OrbitApp<any>)
    },
  )

  // pass in a blank setting so we can access the OrbitApp configs
  genericActiveApps = react(
    () => this.activeApps,
    apps => {
      return Object.keys(getApps).map(type => ({
        ...getApps[type]({}),
        isActive: apps.findIndex(x => x.source === type),
      }))
    },
  )

  private settingsList$ = observeMany(SettingModel, {
    args: {
      where: {
        type: { $not: 'general' },
      },
    },
  }).subscribe(values => {
    this.settingsList = values
  })

  willUnmount() {
    this.settingsList$.unsubscribe()
  }
}
