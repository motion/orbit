import { always, react, shallow, useHook } from '@mcro/use-store'
import { useStoresSimple } from '../hooks/useStores'
import { AppDefinition, AppViews } from '../types/AppDefinition'
import { AppStore } from './AppStore'

type LoadedApp = {
  id: string
  identifier: string
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

  hasLoaded = react(
    () => always(this._apps),
    async (_, { sleep, setValue }) => {
      setValue(false)
      await sleep(64)
      return true
    },
  )

  setApp = (app: { identifier: string; id: string; views: AppViews; provideStores?: Object }) => {
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

  getApp(identifier: string, id: string) {
    let appState = (id && this.apps[id]) || this.getAppByIdentifier(identifier)
    if (appState && appState.identifier !== identifier) {
      throw new Error(
        `You called getApp with a mismatched id/identifier: identifier ${identifier}, id: ${id}`,
      )
    }
    return appState
  }

  getAppByIdentifier(identifier: string) {
    for (const id in this.apps) {
      const app = this.apps[id]
      if (app.identifier === identifier) {
        return app
      }
    }
    return null
  }

  getViewState(identifier: string) {
    const app = this.getAppByIdentifier(identifier)
    return {
      hasMain: app && app.views && !!app.views.main,
      hasIndex: app && app.views && !!app.views.index,
    }
  }
}
