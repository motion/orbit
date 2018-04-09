import React from 'react'
import { object } from 'prop-types'

export default class ThemeProvide extends React.Component {
  static childContextTypes = {
    uiThemes: object,
    provided: object,
  }

  getChildContext() {
    const { children, ...themes } = this.props
    return {
      uiThemes: themes,
      provided: {},
    }
  }

  render() {
    return this.props.children
  }
}
