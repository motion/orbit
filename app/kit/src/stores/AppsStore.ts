import { always, react, shallow, useHook } from '@mcro/use-store'
import { useStoresSimple } from '../hooks/useStores'
import { AppDefinition, AppViews } from '../types/AppDefinition'
import { AppStore } from './AppStore'

type LoadedApp = {
  id: string
  appId: string
  views: AppViews
  provideStores?: any
  appStore?: AppStore
}

type AppsWithDefinitions = {
  [key: string]: LoadedApp & { definition: AppDefinition }
}

export class AppsStore {
  stores = useHook(useStoresSimple)

  _apps: { [key: string]: LoadedApp } = shallow({})
  definitions: { [key: string]: AppDefinition } = shallow({})

  get allIds() {
    const next = [...new Set([...Object.keys(this.apps), ...Object.keys(this.definitions)])]
    return next
  }

  // because these load in waterfall, debounce
  apps = react(
    () => always(this.allIds),
    async (_, { sleep }) => {
      await sleep(16)

      console.warn('run apps', this.allIds)

      const res: AppsWithDefinitions = {}
      for (const key of this.allIds) {
        res[key] = { ...this._apps[key], definition: this.definitions[key] }
      }
      return this._apps
    },
    {
      defaultValue: {},
    },
  )

  setApp = (app: { appId: string; id: string; views: AppViews; provideStores?: Object }) => {
    this._apps[app.id] = app
  }

  setAppStore = (id: string, appStore: AppStore) => {
    this._apps[id].appStore = appStore
  }

  setAppDefinition(id: string, definition: AppDefinition) {
    this.definitions[id] = definition
  }

  // setSettingsView(id: string, settingsView: AppViews['settings']) {
  //   this.appViews[id] = { ...this.appViews[id], settings: settingsView }
  // }

  getApp(appId: string, id: string) {
    const appState = id ? this.apps[id] : this.getAppByAppId(appId)
    if (appState && appState.appId !== appId) {
      throw new Error(`You called getApp with a mismatched id/appId`)
    }
    return appState
  }

  getAppByAppId(appId: string) {
    for (const id in this.apps) {
      const app = this.apps[id]
      if (app.appId === appId) {
        return app
      }
    }
    return null
  }

  getViewState(appId: string) {
    const app = this.getAppByAppId(appId)
    return {
      hasMain: app && app.views && !!app.views.main,
      hasIndex: app && app.views && !!app.views.index,
    }
  }
}
