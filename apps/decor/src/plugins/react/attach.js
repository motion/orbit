import React from 'react'
import { object } from 'prop-types'
import { pickBy } from 'lodash'

export default function attacher(options) {
  return {
    decorator: View => {
      return class ContextAttacher extends React.Component {
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
    },
  }
}
