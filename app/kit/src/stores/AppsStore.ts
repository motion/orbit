import { always, react, useHook } from '@mcro/use-store'
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

export class AppsStore {
  stores = useHook(useStoresSimple)

  _apps: { [key: string]: LoadedApp } = {}
  definitions: { [key: string]: AppDefinition } = {}

  // because these load in waterfall, we debounce
  apps = react(
    () => always(this._apps),
    async (_, { sleep }) => {
      await sleep(16)
      return this._apps
    },
    {
      defaultValue: {},
    },
  )

  setApp = (app: { appId: string; id: string; views: AppViews; provideStores?: Object }) => {
    this._apps = {
      ...this._apps,
      [app.id]: app,
    }
  }

  setAppStore = (id: string, appStore: AppStore) => {
    this._apps[id].appStore = appStore
  }

  setAppDefinition(id: string, definition: AppDefinition) {
    this.definitions = {
      ...this.definitions,
      [id]: definition,
    }
  }

  // setSettingsView(id: string, settingsView: AppViews['settings']) {
  //   this.appViews[id] = { ...this.appViews[id], settings: settingsView }
  // }

  getApp(appId: string, id: string) {
    const appState = id ? this.apps[id] : this.getAppByAppId(appId)
    if (!appState) {
      return {
        definition: this.definitions[appId],
      }
    }
    if (appState.appId !== appId) {
      throw new Error(`You called getApp with a mismatched id/appId`)
    }
    return {
      ...appState,
      definition: this.definitions[appId],
    }
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
