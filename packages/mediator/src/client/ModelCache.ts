import { Model } from '../common'

export type ModelCacheEntry = {
  model: Model<any>
  value: any
  id: number
  subscriptionObservers: ZenObservable.SubscriptionObserver<any>[]
}

export const ModelCache = {
  entries: [] as ModelCacheEntry[],

  add(model: Model<any>, id: number, value: any) {
    let entry = ModelCache.findEntryByQuery(model, id)
    if (entry) {
      entry.value = value
    } else {
      entry = {
        model,
        id,
        value,
        subscriptionObservers: [],
      }
      ModelCache.entries.push(entry)
    }
    return entry
  },

  remove(model: Model<any>, id: number) {
    const entry = ModelCache.findEntryByQuery(model, id)
    if (!entry) return
    if (entry.subscriptionObservers.length === 0) {
      console.warn('remove more than necessary?')
      return
    }
    const index = ModelCache.entries.indexOf(entry)
    if (index !== -1) {
      ModelCache.entries.splice(index, 1)
    }
  },

  findEntryByQuery(model: Model<any>, id: number) {
    return ModelCache.entries.find(entry => entry.model === model && entry.id === id)
  },
}
