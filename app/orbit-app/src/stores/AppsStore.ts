import { SettingModel, Setting, IntegrationType } from '@mcro/models'
import { observeMany } from '@mcro/model-bridge'
import { allApps } from '../apps'
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
    id: `${(model && model.id) || (app.setting && app.setting.id) || Math.random()}`,
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
      return appSettings.filter(x => !!allApps[x.type]).map(this.getAppFromSetting)
    },
  )

  // this is every possible app (that uses a bit), just turned into array
  get appsList(): OrbitApp<any>[] {
    return Object.keys(allApps)
      .map(x => allApps[x])
      .filter(x => x.source === 'bit')
  }

  // pass in a blank setting so we can access the OrbitApp configs
  allApps = react(
    () => this.activeApps,
    activeApps => {
      return this.appsList.map(
        app =>
          ({
            ...app,
            isActive: !!activeApps.find(x => x.integration === app.integration),
          } as GenericApp),
      )
    },
    {
      defaultValue: [],
    },
  )

  appByIntegration = react(() => this.allApps, x => keyBy(x, 'integration'), {
    defaultValue: {},
  })

  getAppFromSetting = (setting: Setting): OrbitApp<any> => {
    return {
      ...allApps[setting.type],
      setting,
    }
  }

  getAppConfig = (model: ResolvableModel): AppConfig => {
    const type = model.target === 'bit' ? model.integration : 'person'
    return appToAppConfig(this.appByIntegration[type], model)
  }

  getView = (type: IntegrationType | 'person', viewType: 'main' | 'setting' | 'item') => {
    if (!this.appByIntegration[type]) {
      return () => 'none'
    }
    return this.appByIntegration[type].views[viewType]
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
