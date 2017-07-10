import React from 'react'
import { object, string } from 'prop-types'
import getThemeFromContext from './getThemeFromContext'

// resolves the active theme object into props.theme as object
// sets props.theme onto context for children
// converts theme="colorname" into color and passes down
export default View => {
  return class ThemeInject extends React.Component {
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

    theme = getThemeFromContext('theme')

    getChildContext() {
      const context = this.theme()
      if (context) {
        return context
      }
    }

    render() {
      const theme = this.theme()
      return <View {...this.props} theme={theme && theme.uiActiveTheme} />
    }
  }
}
