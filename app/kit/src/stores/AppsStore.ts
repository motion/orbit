import { always, react, shallow, useHook } from '@o/use-store'
import { useStoresSimple } from '../hooks/useStores'
import { AppDefinition, AppViews } from '../types/AppDefinition'
import { AppStore } from './AppStore'

type LoadedApp = {
  id: string
  identifier: string
  views: AppViews
  context?: any
  appStore?: AppStore
  version: number
}

type AppsWithDefinitions = {
  [key: string]: LoadedApp & { definition: AppDefinition }
}

export class AppsStore {
  stores = useHook(useStoresSimple)

  _apps: { [key: string]: LoadedApp } = shallow({})
  definitions: { [key: string]: AppDefinition } = shallow({})

  get allIds() {
    return [...new Set([...Object.keys(this._apps), ...Object.keys(this.definitions)])]
  }

  // because these load in waterfall, debounce
  apps: AppsWithDefinitions = react(
    () => always(this.allIds.map(id => this._apps[id])),
    async (_, { sleep }) => {
      await sleep(16)
      const res = {}
      for (const key of this.allIds) {
        res[key] = { ...this._apps[key], definition: this.definitions[key] }
      }
      return res
    },
    {
      defaultValue: {},
    },
  )

  setApp = (app: { identifier: string; id: string; views: AppViews; context?: Object }) => {
    const prev = this._apps[app.id]
    this._apps[app.id] = {
      // merge to prevent overwrite appStore
      ...prev,
      ...app,
      version: prev ? prev.version + 1 : 0,
    }
  }

  setAppStore = (id: string, appStore: AppStore) => {
    this._apps[id].appStore = appStore
  }

  setAppDefinition(id: string, definition: AppDefinition) {
    this.definitions[id] = definition
  }

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
