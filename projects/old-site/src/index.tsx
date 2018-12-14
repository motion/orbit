import './../public/styles/siteBase.css'
import './../public/styles/nucleo.css'
import 'intersection-observer'
import * as React from 'react'
import ReactDOM from 'react-dom'
import themes from './themes'
import { ThemeProvide } from '@mcro/ui'
import * as Constants from './constants'
import * as Black from '@mcro/black'

// for hmr
import './router'

window.Constants = Constants
window.Black = Black

function render() {
  const RootNode = document.querySelector('#app')
  const Root = require('./root').default
  ReactDOM.render(
    <ThemeProvide themes={themes}>
      <Root />
    </ThemeProvide>,
    RootNode,
  )
}

render()

if (module.hot) {
  module.hot.accept(render)
}
