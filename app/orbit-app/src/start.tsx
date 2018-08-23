import '../public/styles/base.css'
import '../public/styles/nucleo.css'
// needs to be imported before react
import 'react-hot-loader'
import 'isomorphic-fetch'
import * as React from 'react'
import ReactDOM from 'react-dom'
import './RootViewHMR'

// separate this so hmr works nicely

export async function start() {
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
  ReactDOM.render(<RootView />, document.querySelector('#app'))
}

start()

if (process.env.NODE_ENV === 'development') {
  if (typeof module.hot !== 'undefined') {
    module.hot.accept(start)
  }
}
