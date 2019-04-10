export type ObserverCacheType = 'one' | 'many' | string
export type ObserverCacheArgs = {
  model: string
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
  removeTimeout?: any
  key: string
  onDispose?: Function
  isActive?: boolean
}

export const ObserverCache = {
  entries: new Map<string, ObserverCacheEntry>(),

  getKey({ model, type, query }: ObserverCacheArgs) {
    return JSON.stringify(`${model}${type}${JSON.stringify(query)}`)
  },

  get(args: ObserverCacheArgs) {
    const key = ObserverCache.getKey(args)
    let entry = ObserverCache.entries.get(key)
    // create empty entry if not
    if (!entry) {
      entry = {
        key,
        args,
        subscriptions: new Set(),
        // store this so its quick to check for updates
        denormalizedValues: {},
        // store this so we keep the sort order
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
          // weird perf opt but works for our cases....
          if (value && Object.keys(value).length < 40) {
            const isEqual = JSON.stringify(value) === JSON.stringify(entry.value)
            if (isEqual) return
          }
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

  updateModels(model: string, values: any[]) {
    const toUpdate = new Set<ObserverCacheEntry>()

    for (const value of values) {
      const { id } = value
      for (const entry of ObserverCache.entries.values()) {
        if (entry.args.model !== model) continue
        // fast lookup here
        if (entry.denormalizedValues[id]) {
          toUpdate.add(entry)
          // update in caches
          if (entry.args.type === 'one') {
            entry.value = value
          } else {
            entry.denormalizedValues[id] = value
          }
        }
      }
    }

    for (const entry of [...toUpdate]) {
      for (const sub of [...entry.subscriptions]) {
        sub.next(entry.value)
      }
    }
  },

  delete(entry: ObserverCacheEntry) {
    ObserverCache.entries.delete(entry.key)
  },
}

if (typeof window !== 'undefined') {
  window['ObserverCache'] = ObserverCache
}
