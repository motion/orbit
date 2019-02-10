import { Model } from '../common'

export type ObserverCacheType = 'one' | 'many' | string
export type ObserverCacheArgs = {
  model: Model<any>
  type: ObserverCacheType
  query: Object
  defaultValue: any
}

export type ObserverCacheEntry = {
  args: ObserverCacheArgs
  subscriptions: Set<ZenObservable.SubscriptionObserver<any>>
  rawValue: any
  value: any
  denormalizedValues: {}
  update: (value: any) => void
}

export const ObserverCache = {
  entries: new Map<string, ObserverCacheEntry>(),

  getKey({ model, type, query }: ObserverCacheArgs) {
    return JSON.stringify(`${model.name}${type}${JSON.stringify(query)}`)
  },

  get(args: ObserverCacheArgs) {
    const key = ObserverCache.getKey(args)
    let entry = ObserverCache.entries.get(key)
    // create empty entry if not
    if (!entry) {
      entry = {
        args,
        subscriptions: new Set(),
        denormalizedValues: {},
        rawValue: args.defaultValue,
        // we only update denormalized values
        get value() {
          if (!entry.rawValue) return entry.rawValue
          if (entry.args.type === 'one') {
            return entry.rawValue
          } else {
            return entry.rawValue.map(i => entry.denormalizedValues[i.id])
          }
        },
        set value(next) {
          if (entry.args.type === 'one') {
            if (!next) {
              entry.rawValue = null
              entry.denormalizedValues = {}
            } else {
              entry.rawValue = next
              entry.denormalizedValues = { [next.id]: next }
            }
          } else {
            if (!next) return
            entry.rawValue = next
            entry.denormalizedValues = {}
            for (const val of next) {
              entry.denormalizedValues[val.id] = val
            }
          }
        },
        update: value => {
          const isEqual = JSON.stringify(value) === JSON.stringify(entry.value)
          if (isEqual) return
          entry.value = value
          for (const sub of entry.subscriptions) {
            sub.next(value)
          }
        },
      }
      ObserverCache.entries.set(key, entry)
    }
    return entry
  },

  updateModels(model: Model<any>, values: any[]) {
    const toUpdate = new Set<ObserverCacheEntry>()

    for (const value of values) {
      const { id } = value
      for (const entry of ObserverCache.entries.values()) {
        if (entry.args.model !== model) continue
        // fast lookup here
        if (entry.denormalizedValues[id]) {
          // update in caches
          if (entry.args.type === 'one') {
            entry.value = value
          } else {
            entry.denormalizedValues[id] = value
          }
        }
        toUpdate.add(entry)
      }
    }

    for (const entry of [...toUpdate]) {
      for (const sub of [...entry.subscriptions]) {
        sub.next(entry.value)
      }
    }
  },
}
