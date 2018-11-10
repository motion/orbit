import '../public/styles/base.css'
import '../public/styles/nucleo.css'
import * as React from 'react'
import ReactDOM from 'react-dom'
import './RootViewHMR'

export async function start() {
  // re-require for hmr to capture new value
  const { RootView } = require('./RootViewHMR')

  // start development store in dev mode
  // avoid HMR re-runs
  if (process.env.NODE_ENV === 'development') {
    if (!window['Root']) {
      console.timeEnd('splash')
      const { DevStore } = require('./stores/DevStore')
      const devStore = new DevStore()
      window['Root'] = devStore
      devStore.rootView = RootView
    }
  }

  // render app
  ReactDOM.render(
    // <React.ConcurrentMode>
    <RootView />,
    // </React.ConcurrentMode>,
    document.querySelector('#app'),
  )
}

start()

if (process.env.NODE_ENV !== 'production') {
  if (typeof module.hot !== 'undefined') {
    module.hot.accept(start)
  }
}
