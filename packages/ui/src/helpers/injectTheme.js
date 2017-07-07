import React from 'react'
import { object } from 'prop-types'
import { Theme } from '@mcro/gloss'
import color from 'color'
import makeTheme from './makeTheme'

// resolves the theme object into props.theme
// and passes the named theme down
// if given theme="name"
const Themes = {}

export default View =>
  class InjectTheme extends React.Component {
    static contextTypes = {
      uiTheme: object,
      theme: object,
    }
    static childContextTypes = {
      uiTheme: object,
      theme: object,
    }

    getChildContext() {
      const { themeName, theme } = this.theme
      return {
        uiTheme: {
          ...this.context.uiTheme,
          [themeName]: theme,
        },
      }
    }

    get theme() {
      const { props, context } = this
      let theme = props.theme && context.uiTheme[props.theme]
      let themeName = props.theme || context.uiActiveTheme
      let isCustom = false

      try {
        if (!theme && typeof props.theme === 'string') {
          isCustom = true
          const base = color(props.theme)
          const opposite = base.mix(base.lighten(10))
          themeName = props.theme
          if (Themes[themeName]) {
            theme = Themes[themeName]
          } else {
            theme = makeTheme({
              highlightColor: base,
              background: base,
              color: opposite.lighten(0.4),
              borderColor: opposite.darken(0.7),
            })
            Themes[themeName] = theme // cache
          }
        }
      } catch (e) {
        if (e.message.indexOf('parse color from string') === -1) {
          // recover only from parse
          throw e
        }
      }

      // so we can check if non-existant earlier
      theme = theme || context.theme

      return { theme, themeName, isCustom }
    }

    render() {
      const { theme, themeName } = this.theme

      return (
        <Theme name={themeName}>
          <View {...this.props} theme={theme} />
        </Theme>
      )
    }
  }
