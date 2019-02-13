import { AppStore } from './AppStore'
import { AppViews } from './AppTypes'

export class AppsStore {
  provideStores = {}
  appViews: { [key: string]: AppViews } = {}
  appStores: { [key: string]: AppStore } = {}

  setupApp = (id: string, views: AppViews, provideStores?: Object) => {
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
