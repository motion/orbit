import React from 'react'
import { object } from 'prop-types'
import { Theme } from '@mcro/gloss'
import color from 'color'
import makeTheme from './makeTheme'

// resolves the theme object into props.theme
// and passes the named theme down
// if given theme="name"
export default View => {
  function InjectTheme(props, context) {
    let theme = (props.theme && context.uiTheme[props.theme]) || context.theme
    let themeName = props.theme || context.uiActiveTheme

    try {
      if (!theme && typeof props.theme === 'string') {
        const base = color('orange')
        const opposite = base.mix(color('blue'))
        themeName = props.theme
        theme = makeTheme({
          highlightColor: base,
          background: base,
          color: opposite,
          borderColor: opposite.darken(1),
        })
        context.uiTheme[props.theme] = theme // add to context
      }
    } catch (e) {
      if (e.message.indexOf('parse color from string') === -1) {
        // recover only from parse
        throw e
      }
    }

    return (
      <Theme name={themeName}>
        <View {...props} theme={theme} />
      </Theme>
    )
  }

  InjectTheme.contextTypes = {
    uiTheme: object,
    theme: object,
  }

  return InjectTheme
}
