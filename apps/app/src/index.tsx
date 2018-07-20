import '../public/styles/base.css'
import '../public/styles/nucleo.css'
import './helpers/createElement'
import 'isomorphic-fetch'
import '@mcro/debug/inject.js'
import * as UI from '@mcro/ui'
import * as React from 'react'
import ReactDOM from 'react-dom'
import { themes } from './themes'
import { throttle } from 'lodash'
import { App } from '@mcro/stores'

if (process.env.NODE_ENV === 'development') {
  if (module && module.hot) {
    module.hot.accept('./actions/appActions', () => {
      console.log('set new actions')
      App.start({ actions: require('./actions/appActions') })
    })
  }
}

Error.stackTraceLimit = Infinity
process.on('uncaughtException', err => {
  console.log('App.uncaughtException', err.stack)
})

// hmr calls render twice out the gate
// so prevent that
export const render = throttle(async () => {
  // Root is the topmost store essentially
  // We export it so you can access a number of helpers
  if (!window['Root']) {
    console.timeEnd('splash')
    const { RootStore } = require('./stores/RootStore')
    const rootStore = new RootStore()
    window['Root'] = rootStore
    await rootStore.start({
      connectModels: window.location.pathname !== '/auth',
    })
  }
  const { RootView } = require('./RootViewHMR')
  // <React.unstable_AsyncMode>
  // </React.unstable_AsyncMode>
  ReactDOM.render(
    <UI.ThemeProvide themes={themes} defaultTheme="light">
      <RootView />
    </UI.ThemeProvide>,
    document.querySelector('#app'),
  )
}, 32)

render()

// do this at end so it can import any instantiated things it wants to set on window.*
// also a bit safer as it ensures we don't rely on it for anything  downstraem
require('./helpers/installDevelopmentHelpers')

if (process.env.NODE_ENV === 'development') {
  module.hot && module.hot.accept(render)
}
