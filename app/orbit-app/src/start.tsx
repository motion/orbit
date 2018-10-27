import '../public/styles/base.css'
import '../public/styles/nucleo.css'
import * as React from 'react'
import ReactDOM from 'react-dom'
import './RootViewHMR'

export async function start() {
  // re-require for hmr to capture new value
  const { RootView } = require('./RootViewHMR')
  // Root is the topmost store essentially
  // We export it so you can access a number of helpers
  if (!window['Root']) {
    console.timeEnd('splash')
    const { RootStore } = require('./stores/RootStore')
    const rootStore = new RootStore()
    window['Root'] = rootStore
    rootStore.rootView = RootView
  }
  ReactDOM.render(<RootView />, document.querySelector('#app'))
}

start()

if (process.env.NODE_ENV !== 'production') {
  if (typeof module.hot !== 'undefined') {
    module.hot.accept(start)
  }
}
