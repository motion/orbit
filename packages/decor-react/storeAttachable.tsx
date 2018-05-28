import * as React from 'react'
import pickBy from 'lodash/pickBy'
import { StoreContext } from '~/contexts'

export interface ContextAttacher {}

export function storeAttachable(options): ContextAttacher {
  return {
    name: 'storeAttachable',
    once: true,
    decorator: View => {
      const ContextAttacher = props => (
        <StoreContext.Consumer>
          {stores => (
            <View
              {...props}
              {...pickBy(stores, (_, key) => options.stores.indexOf(key) >= 0)}
            />
          )}
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
