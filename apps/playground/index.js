// @flow
import Main from './main'
import React from 'react'
import ReactDOM from 'react-dom'
import { Theme, ThemeProvide } from '@mcro/ui'
import themes from './theme'

ReactDOM.render(
  <ThemeProvide {...themes}>
    <Main />
  </ThemeProvide>,
  document.getElementById('app')
)

if (module.hot) {
  module.hot.accept()
  module.hot.accept('./theme')
}
