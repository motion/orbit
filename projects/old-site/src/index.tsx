import { ThemeProvide } from '@o/ui'
import 'intersection-observer'
import * as React from 'react'
import ReactDOM from 'react-dom'
import './../public/styles/nucleo.css'
import './../public/styles/siteBase.css'
// for hmr
import './router'
import themes from './themes'

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
