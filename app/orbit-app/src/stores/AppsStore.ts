import { SettingModel, Setting, IntegrationType } from '@mcro/models'
import { observeMany } from '@mcro/model-bridge'
import { getApps } from '../apps'
import { react } from '@mcro/black'
import { OrbitApp, ResolvableModel } from '../apps/types'
import { keyBy } from 'lodash'
import { AppConfig } from '@mcro/stores'

type GenericApp = OrbitApp<any> & {
  isActive: boolean
}

const appToAppConfig = (app: OrbitApp<any>): AppConfig => {
  return {
    id: `${app.id || Math.random()}`,
    icon: app.display.icon,
    iconLight: app.display.iconLight,
    title: app.display.name,
    type: app.source,
    integration: app.integration,
    viewConfig: app.viewConfig,
  }
}

export class AppsStore {
  settingsList: Setting[] = []

  activeApps = react(
    () => this.settingsList,
    appsList => {
      return appsList.map(setting => getApps[setting.type](setting) as OrbitApp<any>)
    },
  )

  // pass in a blank setting so we can access the OrbitApp configs
  allApps = react(
    () => this.activeApps,
    apps => {
      return Object.keys(getApps).map(
        type =>
          ({
            ...getApps[type]({}),
            source: type, // todo remove...
            isActive: apps.findIndex(x => x.source === type),
          } as GenericApp),
      )
    },
    {
      defaultValue: [],
    },
  )

  allAppsObj = react(() => this.allApps, x => keyBy(x, 'source'), {
    defaultValue: {},
  })

  getAppConfig = (model: ResolvableModel): AppConfig => {
    const type = model.target === 'bit' ? model.integration : 'person'
    return appToAppConfig(this.allAppsObj[type])
  }

  getView = (type: IntegrationType | 'person', viewType: 'main' | 'setting' | 'item') => {
    console.log('getting type', type)
    if (!this.allAppsObj[type]) {
      return () => 'none'
    }
    return this.allAppsObj[type].views[viewType]
  }

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
