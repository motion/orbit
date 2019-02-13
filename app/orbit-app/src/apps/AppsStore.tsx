import { react } from '@mcro/black'
import { AppStore } from './AppStore'
import { AppViews } from './AppTypes'

export class AppsStore {
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
