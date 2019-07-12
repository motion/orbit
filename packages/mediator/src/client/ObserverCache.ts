import { isEqual } from '@o/fast-compare'
import { pick } from 'lodash'

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
  // for debugging
  component?: any
}

const currentComponent = () => {
  if (process.env.NODE_ENV === 'development') {
    return require('react').__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner
      .current
  }
}

const selectModel = (entry: ObserverCacheEntry, value: any) => {
  const select = entry.args.query && entry.args.query['select']
  return select ? pick(value, select) : value
}

export const ObserverCache = {
  entries: new Map<string, ObserverCacheEntry>(),

  getKey({ model, type, query }: ObserverCacheArgs) {
    return `${model}${type}${JSON.stringify(query)}`
  },

  get(args: ObserverCacheArgs) {
    const key = ObserverCache.getKey(args)
    let entry = ObserverCache.entries.get(key) || {
      key,
      args,
      component: currentComponent(),
      subscriptions: new Set<ZenObservable.SubscriptionObserver<any>>(),
      // store this so its quick to check for updates
      denormalizedValues: {},
      // store this so we keep the sort order
      value: undefined,
      // this is an update from the server side
      // we only update denormalized values
      update: value => {
        // weird perf opt but works for our cases....
        if (value && typeof value === 'object' && Object.keys(value).length < 50) {
          if (isEqual(value, entry.value)) return
        }
        entry.value = value
        for (const sub of entry.subscriptions) {
          sub.next(value)
        }
      },
    }
    ObserverCache.entries.set(key, entry)
    return entry
  },

  // this is an update from client side
  updateModels(model: string, values: any[]) {
    const toUpdate = new Set<ObserverCacheEntry>()

    for (const value of values) {
      const { id } = value

      for (const entry of ObserverCache.entries.values()) {
        if (entry.args.model !== model) continue

        if (entry.args.type === 'many') {
          const cur = entry.denormalizedValues[id]
          if (cur) {
            const next = selectModel(entry, value)
            if (!isEqual(next, cur)) {
              toUpdate.add(entry)
              entry.denormalizedValues[id] = next
            }
          }
        } else {
          if (!entry.value) continue // does this cause cache problems?
          if (entry.value.id === id) {
            const next = selectModel(entry, value)
            if (!isEqual(entry.value, next)) {
              toUpdate.add(entry)
              entry.value = next
            }
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
