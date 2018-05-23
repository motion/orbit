import * as React from 'react'
import { object } from 'prop-types'

export class ThemeProvide extends React.Component {
  props: {
    children: any
  }

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
