import { ensure, react } from '@mcro/black'
import { useHook } from '@mcro/use-store'
import { useStoresSimple } from '../hooks/useStores'
import { apps } from './apps'
import { appsStatic } from './appsStatic'
import { AppStore } from './AppStore'
import { AppViews } from './AppTypes'

function getViewInformation(type: string, views?: AppViews) {
  if (!views) {
    return {
      hasMain: false,
      hasIndex: false,
    }
  }

  let hasIndex = false
  let hasMain = false

  if (views) {
    // dynamic app view
    hasMain = !!views.main
    hasIndex = !!views.index
  } else {
    // static view we provide for alternate panes like settings/onboarding
    const app = apps[type]
    hasIndex = !!app['index']
    hasMain = !!app['main']
  }

  return {
    hasMain,
    hasIndex,
  }
}

export class AppsStore {
  stores = useHook(useStoresSimple)
  provideStores = {}
  appViews: { [key: string]: AppViews } = {
    ...appsStatic,
  }
  appStores: { [key: string]: AppStore } = {}

  appsState = react(
    () => [this.provideStores, this.appViews, this.appStores],
    async ([provideStores, appViews, appStores], { sleep }) => {
      // debounced because things mount in waterfall
      await sleep(10)
      return {
        provideStores,
        appViews,
        appStores,
      }
    },
  )

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

  setupApp = (id: string, views: AppViews, provideStores?: Object) => {
    this.appViews = {
      ...this.appViews,
      [id]: views,
    }
    if (provideStores) {
      this.provideStores = {
        ...this.provideStores,
        [id]: provideStores,
      }
    }
  }

  handleAppStore = (id: string, store: AppStore) => {
    this.appStores = {
      ...this.appStores,
      [id]: store,
    }
  }
}
