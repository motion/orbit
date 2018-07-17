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
            let stores = {}
            if (
              options.stores.length === 1 &&
              typeof options.stores[0] === 'object'
            ) {
              // allow object attach style:
              // @view.attach({ name: StoreReference })
              for (const name of Object.keys(options.stores[0])) {
                stores[name] = allStores[name]
              }
            } else {
              // or use string @view.attach('appStore')
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
          return true
        },
      })
    },
  }
}
