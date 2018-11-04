import * as React from 'react'
import { StoreContext } from './contexts'

export interface ContextAttacher {}

export function storeAttachable(options): ContextAttacher {
  return {
    name: 'storeAttachable',
    once: true,
    decorator: View => {
      const ContextAttacher = props => (
        <StoreContext.Consumer>
          {allStores => {
            console.log('attaching', allStores, options.stores)
            if (!allStores) {
              return <View {...props} />
            }
            let stores = {}
            if (options.stores.length === 1 && typeof options.stores[0] === 'object') {
              // allow object attach style:
              // @attach({ name: StoreReference })
              for (const name of Object.keys(options.stores[0])) {
                stores[name] = allStores[name]
              }
            } else {
              // or use string @attach('viewStore')
              for (const name of options.stores) {
                stores[name] = allStores[name]
              }
            }
            return <View {...props} {...stores} />
          }}
        </StoreContext.Consumer>
      )
      // pass statics down
      return new Proxy(ContextAttacher, {
        set(_, method, value) {
          View[method] = value
          ContextAttacher[method] = value
          return true
        },
      })
    },
  }
}
