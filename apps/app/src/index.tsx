import '../public/styles/base.css'
import '../public/styles/nucleo.css'
import 'react-hot-loader'
import 'isomorphic-fetch'
import * as React from 'react'
import ReactDOM from 'react-dom'
import './RootViewHMR'
import './helpers/createElement'

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
  ReactDOM.render(<RootView />, document.querySelector('#app'))
}

render()

if (process.env.NODE_ENV === 'development') {
  module.hot && module.hot.accept(render)
}
