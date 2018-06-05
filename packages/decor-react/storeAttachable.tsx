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
            for (const name of options.stores) {
              stores[name] = allStores[name]
            }
            return (
              <View
                {...props}
                {...stores}
              />
            )
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
