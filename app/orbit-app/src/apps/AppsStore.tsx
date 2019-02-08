import { AppStore } from './AppStore'
import { AppViews } from './AppTypes'

export class AppsStore {
  appViews: { [key: string]: AppViews } = {}
  appStores: { [key: string]: AppStore } = {}

  handleAppViews = (id: string, views: AppViews) => {
    this.appViews = {
      ...this.appViews,
      [id]: views,
    }
  }

  handleAppStore = (id: string, store: AppStore) => {
    this.appStores = {
      ...this.appStores,
      [id]: store,
    }
  }
}
