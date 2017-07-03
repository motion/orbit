import React from 'react'
import { object, string } from 'prop-types'

export default class Theme extends React.Component {
  static contextTypes = {
    uiTheme: object,
  }

  static childContextTypes = {
    uiActiveTheme: string,
    theme: object,
  }

  getChildContext() {
    if (this.props.name) {
      const uiActiveTheme = this.props.name || this.props.theme
      return {
        uiActiveTheme,
        theme: this.context.uiTheme[uiActiveTheme],
      }
    }
  }

  render() {
    return React.Children.only(this.props.children)
  }
}
