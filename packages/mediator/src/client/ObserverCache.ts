import Observable from 'zen-observable'
import { Model } from '../common'
import { ModelCache } from './ModelCache'

export type ObserverCacheType = string
export type ObserverCacheArgs = {
  model: Model<any>
  type: ObserverCacheType
  query: Object
}
type ObserverCacheEntry = {
  args: ObserverCacheArgs
  observable: Observable<any>
  removeTimer: any
  values: { id: number }[]
}

export const ObserverCache = {
  entries: new Map<string, ObserverCacheEntry>(),

  getKey({ model, type, query }: ObserverCacheArgs) {
    return JSON.stringify(`${model.name}${type}${JSON.stringify(query)}`)
  },

  get(args: ObserverCacheArgs) {
    const key = ObserverCache.getKey(args)
    let next = ObserverCache.entries.get(key)
    // create empty entry if not
    if (!next) {
      next = {
        args,
        observable: null,
        removeTimer: 0,
        values: [],
      }
      ObserverCache.entries.set(key, next)
    }
    if (next.removeTimer) {
      clearTimeout(next.removeTimer)
    }
    return next
  },

  remove(args: ObserverCacheArgs) {
    const entry = ObserverCache.get(args)
    if (!entry) return
    entry.removeTimer = setTimeout(() => {
      for (const model of entry.values) {
        ModelCache.remove(args.model, model.id)
      }
      ObserverCache.entries.delete(ObserverCache.getKey(args))
    }, 5000)
  },

  updateModel(model: Model<any>, id: number, value: any) {
    ModelCache.add(model, id, value)
  },
}
