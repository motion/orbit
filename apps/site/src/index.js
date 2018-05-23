import './createElement'
import 'regenerator-runtime/runtime'
import 'babel-polyfill'
import 'intersection-observer'
import * as React from 'react'
import ReactDOM from 'react-dom'
import Themes from '~/themes'
import { ThemeProvide } from '@mcro/ui'
import * as Constants from '~/constants'

window.Constants = Constants

function render() {
  setTimeout(() => {
    console.log('rerender')
  })
  const RootNode = document.querySelector('#app')
  const Root = require('./root').default
  ReactDOM.render(
    <ThemeProvide {...Themes}>
      <Root />
    </ThemeProvide>,
    RootNode,
  )
}

render()

if (module.hot) {
  module.hot.accept(render)
}
