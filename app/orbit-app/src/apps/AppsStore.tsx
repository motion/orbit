import { ensure, react } from '@mcro/black'
import { useHook } from '@mcro/use-store'
import { useStoresSimple } from '../hooks/useStores'
import { apps } from './apps'
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
  appViews: { [key: string]: AppViews } = {}
  appStores: { [key: string]: AppStore } = {}

  // debounced because things mount in waterfall
  appsState = react(
    () => [this.provideStores, this.appViews, this.appStores],
    async ([provideStores, appViews, appStores], { sleep }) => {
      await sleep()
      return {
        provideStores,
        appViews,
        appStores,
      }
    },
  )

  viewsState = react(
    () => this.appsState,
    appsState => {
      ensure('appsState', !!appsState)
      const res: { [key: string]: ReturnType<typeof getViewInformation> } = {}
      for (const key in appsState.appViews) {
        res[key] = getViewInformation(key, appsState.appViews[key])
      }
      return res
    },
    {
      defaultValue: {},
    },
  )

  currentView = react(
    () => {
      const { paneManagerStore } = this.stores
      const { id } = paneManagerStore.activePane
      return this.viewsState[id]
    },
    _ => _,
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
