import '../public/styles/base.css'
import '../public/styles/nucleo.css'
import 'react-hot-loader'
import 'isomorphic-fetch'
import * as UI from '@mcro/ui'
import * as React from 'react'
import ReactDOM from 'react-dom'
import { themes } from './themes'
import debug from '@mcro/debug'
import './RootViewHMR'

// quiet everything
setTimeout(() => {
  debug.quiet()
})

// hmr calls render twice out the gate
// so prevent that
export async function render() {
  console.log('rendering app')
  const { RootView } = require('./RootViewHMR')
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
    rootStore.rootView = RootView
  }
  ReactDOM.render(
    <UI.ThemeProvide themes={themes} defaultTheme="light">
      <RootView />
    </UI.ThemeProvide>,
    document.querySelector('#app'),
  )
}

// this imports render and then patches createElement, needs to be here
require('./helpers/installDevelopmentHelpers')

render()

if (process.env.NODE_ENV === 'development') {
  module.hot && module.hot.accept(render)
}
