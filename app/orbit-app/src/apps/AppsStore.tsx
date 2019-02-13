import { react } from '@mcro/black'
import { useHook } from '@mcro/use-store'
import { useStoresSimple } from '../hooks/useStores'
import { apps } from './apps'
import { AppStore } from './AppStore'
import { AppViews } from './AppTypes'

export class AppsStore {
  stores = useHook(useStoresSimple)
  provideStores = {}
  appViews: { [key: string]: AppViews } = {}
  appStores: { [key: string]: AppStore } = {}

  // debounced because things mount in waterfall
  appsState = react(
    () => [this.provideStores, this.appViews, this.appStores],
    async ([provideStores, appViews, appStores], { sleep }) => {
      await sleep(40)
      return {
        provideStores,
        appViews,
        appStores,
      }
    },
  )

  currentView = react(
    () => {
      const { paneManagerStore } = this.stores
      const { activePane } = paneManagerStore

      if (!this.appsState) {
        return {
          hasMain: false,
          hasIndex: false,
        }
      }

      let hasIndex = false
      let hasMain = false

      const views = this.appsState.appViews[activePane.id]
      if (views) {
        // dynamic app view
        hasMain = !!views.main
        hasIndex = !!views.index
      } else {
        // static view we provide for alternate panes like settings/onboarding
        const app = apps[activePane.type]
        hasIndex = !!app['index']
        hasMain = !!app['main']
      }

      return {
        hasMain,
        hasIndex,
      }
    },
    async (next, { sleep }) => {
      await sleep()
      return next
    },
    {
      defaultValue: {
        hasMain: true,
        hasIndex: true,
      },
    },
  )

  setupApp = (id: string, views: AppViews, provideStores?: Object) => {
    console.warn('setting up app')
    this.appViews = {
      ...this.appViews,
      [id]: views,
    }
    if (provideStores) {
      console.log('provide them', this.provideStores, provideStores)
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
