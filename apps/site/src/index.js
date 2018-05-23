import './createElement'
// import 'regenerator-runtime/runtime'
// import 'babel-polyfill'
// import 'intersection-observer'
import * as React from 'react'
import ReactDOM from 'react-dom'
// import Themes from '~/themes'
// import { ThemeProvide } from '@mcro/ui'
// import * as Constants from '~/constants'

// for hmr
// import '~/router'

// window.Constants = Constants

async function render() {
  await new Promise(res => setTimeout(res, 1000))
  if (window.restartRouter) {
    console.log('restarting router')
    window.restartRouter()
  }
  const RootNode = document.querySelector('#app')
  const Root = require('./components/Join').Join
  ReactDOM.render(<Root />, RootNode)
}

render()

if (module.hot) {
  module.hot.accept(render)
}
