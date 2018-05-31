import React from 'react'
import { object } from 'prop-types'

export const injectTheme = View => {
  class ThemeInject extends React.Component {
    static contextTypes = {
      uiActiveTheme: object,
    }

    render() {
      const theme = this.context.uiActiveTheme
      return <View {...this.props} theme={theme} />
    }
  }
  return new Proxy(ThemeInject, {
    set(target, method, value) {
      View[method] = value
      return true
    },
  })
}
