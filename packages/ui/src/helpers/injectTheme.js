import React from 'react'
import { object } from 'prop-types'
import { Theme } from '@mcro/gloss'

// resolves the theme object into props.theme
// and passes the named theme down
// if given theme="name"
export default View => {
  function InjectTheme(props, context) {
    const theme = (props.theme && context.uiTheme[props.theme]) || context.theme
    return (
      <Theme name={props.theme || context.uiActiveTheme}>
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
