import * as React from 'react'
import { object, string } from 'prop-types'
import { getThemeFromContext } from './getThemeFromContext'

export class Theme extends React.Component {
  static contextTypes = {
    uiActiveThemeName: string,
    uiActiveTheme: object,
    uiThemes: object,
  }

  static childContextTypes = {
    uiActiveThemeName: string,
    uiActiveTheme: object,
    uiThemes: object,
  }

  theme = getThemeFromContext('name', 'theme')

  getChildContext() {
    const context = this.theme()
    if (context) {
      return context
    }
    return this.context
  }

  render() {
    return this.props.children
  }
}
