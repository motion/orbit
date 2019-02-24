import { ensure, react, useHook } from '@mcro/use-store'
import { useStoresSimple } from '../hooks/useStores'
import { AppDefinition, AppViews } from '../types/AppDefinition'
import { AppStore } from './AppStore'

function getViewInformation(_type: string, views?: AppViews) {
  return {
    hasMain: views && !!views.main,
    hasIndex: views && !!views.index,
  }
}

export class AppsStore {
  stores = useHook(useStoresSimple)

  // deep objects for adding apps to:
  provideStores = {}
  appViews: { [key: string]: AppViews } = {}
  appStores: { [key: string]: AppStore } = {}
  definitions: { [key: string]: AppDefinition } = {}

  // accumulated, debounced state (because things mount in waterfall)
  appsState = react(
    () => [this.provideStores, this.appViews, this.appStores, this.definitions],
    async ([provideStores, appViews, appStores, definitions], { sleep }) => {
      await sleep(10)
      return {
        provideStores,
        appViews,
        appStores,
        definitions,
      }
    },
    {
      defaultValue: {
        provideStores: {},
        appViews: {},
        appStores: {},
        definitions: {},
      },
    },
  )

  setupApp = (id: string, views: AppViews, provideStores?: Object) => {
    console.log('setting up app', id, views, provideStores)
    if (this.appViews[id]) {
      console.log('already set up')
      return
    }
    this.appViews = {
      ...this.appViews,
      [id]: { ...this.appViews[id], ...views },
    }
    if (provideStores) {
      this.provideStores = {
        ...this.provideStores,
        [id]: provideStores,
      }
    }
  }

  setAppDefinition(id: string, definition: AppDefinition) {
    this.definitions = {
      ...this.definitions,
      [id]: definition,
    }
  }

  getViewState(id: string) {
    return (
      this.viewsState[id] || {
        hasIndex: false,
        hasMain: false,
      }
    )
  }

  viewsState = react(
    () => this.appsState,
    appsState => {
      const res: { [key: string]: ReturnType<typeof getViewInformation> } = {}
      if (appsState) {
        for (const key in appsState.appViews) {
          res[key] = getViewInformation(key, appsState.appViews[key])
        }
      }
      return res
    },
  )

  currentView = react(
    () => {
      const { activePane } = this.stores.paneManagerStore
      ensure('activePane', !!activePane)
      return this.viewsState[activePane.id]
    },
    {
      defaultValue: {
        hasMain: true,
        hasIndex: true,
      },
    },
  )

  addSettingsView(id: string, settingsView: AppViews['settings']) {
    this.appViews[id] = { ...this.appViews[id], settings: settingsView }
  }

  handleAppStore = (id: string, store: AppStore) => {
    this.appStores = {
      ...this.appStores,
      [id]: store,
    }
  }
}
