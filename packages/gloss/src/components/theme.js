import React from 'react'
import { string } from 'prop-types'

export default class Theme extends React.Component {
  static childContextTypes = {
    uiActiveTheme: string,
  }

  getChildContext() {
    if (this.props.name) {
      return {
        uiActiveTheme: this.props.name,
      }
    }
  }

  render() {
    return React.Children.only(this.props.children)
  }
}
