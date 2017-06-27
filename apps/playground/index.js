// @flow
import Main from './main'
import React from 'react'
import ReactDOM from 'react-dom'
import { Theme, ThemeProvide } from '@jot/ui'
import themes from './theme'

ReactDOM.render(
  <ThemeProvide {...themes}>
    <Theme name="dark">
      <Main />
    </Theme>
  </ThemeProvide>,
  document.getElementById('app')
)

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept(() => {})
}
