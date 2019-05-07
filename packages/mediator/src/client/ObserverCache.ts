export type ObserverCacheType = 'one' | 'many' | string
export type ObserverCacheArgs = {
  model: string
  type: ObserverCacheType
  query: Object
}

export type ObserverCacheEntry = {
  args: ObserverCacheArgs
  subscriptions: Set<ZenObservable.SubscriptionObserver<any>>
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
    return `${model}${type}${JSON.stringify(query)}`
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
        value: undefined,
        // we only update denormalized values
        update: value => {
          // weird perf opt but works for our cases....
          if (value && typeof value === 'object' && Object.keys(value).length < 30) {
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
        if (entry.args.type === 'many') {
          if (entry.denormalizedValues[id]) {
            toUpdate.add(entry)
            entry.denormalizedValues[id] = value
          }
        } else {
          if (entry.value[id]) {
            toUpdate.add(entry)
            entry.value = value
          }
        }
      }
    }

    for (const entry of [...toUpdate]) {
      for (const sub of [...entry.subscriptions]) {
        // re-calculate value now (doing this on save is better than on every render)
        if (entry.args.type === 'many') {
          entry.value = entry.value.map(i => entry.denormalizedValues[i.id])
        }
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
