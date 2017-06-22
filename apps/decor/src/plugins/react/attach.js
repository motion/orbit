import React from 'react'
import { object } from 'prop-types'
import { pickBy } from 'lodash'
import hoistStatics from 'hoist-non-react-statics'

export default function attacher(options) {
  return {
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
                (value, key) => key.indexOf(options.names) >= 0
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
