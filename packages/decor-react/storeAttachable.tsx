import * as React from 'react'
import { object } from 'prop-types'
import pickBy from 'lodash/pickBy'
import hoistStatics from 'hoist-non-react-statics'

export function storeAttachable(options) {
  return {
    name: 'storeAttachable',
    once: true,
    decorator: View => {
      class ContextAttacher extends React.Component {
        static contextTypes = {
          stores: object,
        }

        render() {
          return (
            <View
              {...this.props}
              {...pickBy(
                this.context.stores,
                (_, key) => options.names.indexOf(key) >= 0,
              )}
            />
          )
        }
      }

      // copy statics
      hoistStatics(ContextAttacher, View)

      return ContextAttacher
    },
  }
}
