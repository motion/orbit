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

export const appToAppConfig = (app: OrbitApp<any>, model?: ResolvableModel): AppConfig => {
  if (!app) {
    throw new Error(`No app given: ${JSON.stringify(app)}`)
  }
  return {
    id: `${(model && model.id) || app.id || Math.random()}`,
    icon: app.display.icon,
    iconLight: app.display.iconLight,
    title: app.display.name,
    type: app.source,
    integration: app.integration,
    viewConfig: app.viewConfig,
  }
}

export class AppsStore {
  appSettings: Setting[] = []

  activeApps = react(
    () => this.appSettings,
    appSettings => {
      return appSettings.map(setting => getApps[setting.type](setting) as OrbitApp<any>)
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
            isActive: apps.findIndex(x => x.source === type),
          } as GenericApp),
      )
    },
    {
      defaultValue: [],
    },
  )

  allAppsObj = react(() => this.allApps, x => keyBy(x, 'integration'), {
    defaultValue: {},
  })

  getAppFromSetting = (setting: Setting): OrbitApp<any> => {
    return {
      ...this.allAppsObj[setting.type],
      id: setting.id,
    }
  }

  getAppConfig = (model: ResolvableModel): AppConfig => {
    const type = model.target === 'bit' ? model.integration : 'person'
    console.log('gett app config for', type, this.allAppsObj)
    return appToAppConfig(this.allAppsObj[type], model)
  }

  getView = (type: IntegrationType | 'person', viewType: 'main' | 'setting' | 'item') => {
    if (!this.allAppsObj[type]) {
      return () => 'none'
    }
    return this.allAppsObj[type].views[viewType]
  }

  private appSettings$ = observeMany(SettingModel, {
    args: {
      where: {
        type: { $not: 'general' },
      },
    },
  }).subscribe(values => {
    this.appSettings = values
  })

  willUnmount() {
    this.appSettings$.unsubscribe()
  }
}
