import { Model } from '../common'

export type ObserverCacheType = 'one' | 'many' | string
export type ObserverCacheArgs = {
  model: Model<any>
  type: ObserverCacheType
  query: Object
}

type ObserverCacheEntry = {
  args: ObserverCacheArgs
  subscriptions: Set<ZenObservable.SubscriptionObserver<any>>
  rawValue: any
  value: any
  denormalizedValues: {}
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
        rawValue: null,
        // we only update denormalized values
        get value() {
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
            entry.rawValue = next
            entry.denormalizedValues = {}
            for (const val of next) {
              entry.denormalizedValues[val.id] = val
            }
          }
        },
      }
      ObserverCache.entries.set(key, entry)
    }
    return entry
  },

  nextUpdates: new Set<ObserverCacheEntry>(),
  nextUpdate: null,

  flush() {
    if (ObserverCache.nextUpdate) {
      clearTimeout(ObserverCache.nextUpdate)
    }
    ObserverCache.nextUpdate = setTimeout(() => {
      for (const entry of [...ObserverCache.nextUpdates]) {
        console.log('flush', [...entry.subscriptions])
        for (const sub of [...entry.subscriptions]) {
          sub.next(entry.value)
        }
      }
      ObserverCache.nextUpdates = new Set()
    }, 0)
  },

  updateModels(model: Model<any>, values: any[]) {
    for (const value of values) {
      const { id } = value
      for (const entry of ObserverCache.entries.values()) {
        if (entry.args.model !== model) continue
        // fast lookup here
        if (entry.denormalizedValues[id]) {
          console.log('hit, update', entry)
          entry.denormalizedValues[id] = value
          ObserverCache.nextUpdates.add(entry)
          ObserverCache.flush()
        }
      }
    }
  },
}
