import { Model } from '../common'

export type ModelCacheEntry = {
  query: string
  model: Model<any>
  value: any
  removeTimer: number
  subscriptionObservers: ZenObservable.SubscriptionObserver<any>[]
  initialized: boolean
}

export const ModelCache = {
  entries: [] as ModelCacheEntry[],

  add(model: Model<any>, id: number, value: any) {
    let entry = this.findEntryByQuery(model, id)
    if (entry) {
      entry.value = value
      entry.initialized = true

      console.log('SHOULD UPDATE FELLOW MODELS', id, value)
    } else {
      entry = {
        model,
        id,
        value,
        subscriptionObservers: [],
      }
      this.entries.push(entry)
    }
    return entry
  },

  remove(model: Model<any>, id: number) {
    const entry = this.findEntryByQuery(model, id)
    if (!entry) return
    if (entry.subscriptionObservers.length === 0) {
      console.warn('remove more than necessary?')
      return
    }
    const index = this.entries.indexOf(entry)
    if (index !== -1) {
      this.entries.splice(index, 1)
    }
  },

  findEntryByQuery(model: Model<any>, id: number) {
    return this.entries.find(entry => entry.model === model && entry.id === id)
  },
}
