import React from 'react'
import { object, string } from 'prop-types'

export default View => {
  return class ThemeInject extends React.Component {
    static contextTypes = {
      uiActiveThemeName: string,
      uiActiveTheme: object,
      uiThemes: object,
    }

    render() {
      const theme = this.context.uiActiveTheme
      return <View {...this.props} theme={theme} />
    }
  }
}
