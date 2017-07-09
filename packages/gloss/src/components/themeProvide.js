import React from 'react'
import { object } from 'prop-types'

export default class ThemeProvide extends React.Component {
  static childContextTypes = {
    uiThemes: object,
    provided: object,
  }

  getChildContext() {
    return {
      uiThemes: this.props,
      provided: {},
    }
  }

  render() {
    return this.props.children
  }
}
