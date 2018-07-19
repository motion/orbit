// any js thats imported here but should work with HMR
// should also be added to ./RootViewHMR!
import '../public/styles/base.css'
import '../public/styles/nucleo.css'
import './helpers/createElement'
import 'isomorphic-fetch'
import '@mcro/debug/inject.js'
import './helpers/installDevelopmentHelpers'
import { RootStore } from './stores/RootStore'
import * as UI from '@mcro/ui'
import * as React from 'react'
import ReactDOM from 'react-dom'
import Themes from './themes'
import { throttle } from 'lodash'
import { Gloss } from '@mcro/black'

Error.stackTraceLimit = Infinity

process.on('uncaughtException', err => {
  console.log('App.uncaughtException', err.stack)
})

// hmr calls render twice out the gate
// so prevent that
const render = throttle(async () => {
  // Root is the topmost store essentially
  // We export it so you can access a number of helpers
  if (!window['Root']) {
    console.warn(`NODE_ENV=${process.env.NODE_ENV} ${window.location.pathname}`)
    console.timeEnd('splash')
    const rootStore = new RootStore()
    window['Root'] = rootStore
    window['restart'] = rootStore.restart
    await rootStore.start()
  }
  const { RootViewHMR } = require('./RootViewHMR')
  // <React.unstable_AsyncMode>
  // </React.unstable_AsyncMode>
  ReactDOM.render(
    <UI.ThemeProvide {...Themes}>
      <UI.Theme name="light">
        <RootViewHMR />
      </UI.Theme>
    </UI.ThemeProvide>,
    document.querySelector('#app'),
  )
}, 32)

render()

// hacky for now, fixing soon, hmr needs it in RootView.tsx
// @ts-ignore
window.render = render

module.hot && module.hot.accept(render)
