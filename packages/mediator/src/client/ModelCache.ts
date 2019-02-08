import { Model } from '../common'

export type ModelCacheType = 'one' | 'many' | 'count'

export type ModelCacheEntry = {
  type: ModelCacheType
  query: string
  model: Model<any>
  value: any
  removeTimer: number
  subscriptionObservers: ZenObservable.SubscriptionObserver<any>[]
  initialized: boolean
}

export const ModelCache = {
  entries: [] as ModelCacheEntry[],

  add(model: Model<any>, type: ModelCacheType, query: any, value: any, initialized: boolean) {
    // if there is entry remove it, add it to the cache again
    // and create a new entry and store it in the cache
    let entry = this.findEntryByQuery(model, type, query)
    if (entry) {
      entry.value = value
      entry.initialized = true
      if (entry.removeTimer) clearTimeout(entry.removeTimer)
    } else {
      entry = {
        model,
        type,
        query: JSON.stringify(query || {}),
        value,
        subscriptionObservers: [],
        initialized
      }
      this.entries.push(entry)
    }
    return entry
  },

  remove(model: Model<any>, type: ModelCacheType, query: any) {
    const entry = this.findEntryByQuery(model, type, query)
    if (!entry) return
    if (entry.subscriptionObservers.length > 0) return

    // console.log(`removing in 5 seconds`)
    if (entry.removeTimer) {
      clearTimeout(entry.removeTimer)
    }
    entry.removeTimer = setTimeout(() => {
      const index = this.entries.indexOf(entry)
      if (index !== -1) this.entries.splice(index, 1)
      // console.log(`removed from cache!`)
    }, 5000)
  },

  findEntryByQuery(model: Model<any>, type: ModelCacheType, query: Object) {
    return this.entries.find(entry => {
      return (
        entry.type === type && entry.model === model && entry.query === JSON.stringify(query || {})
      )
    })
  },
}
