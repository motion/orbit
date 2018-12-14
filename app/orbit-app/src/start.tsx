import '../public/styles/base.css'
import '../public/styles/nucleo.css'
import * as React from 'react'
import ReactDOM from 'react-dom'

export async function start() {
  // start development store in dev mode, avoid HMR re-runs
  if (process.env.NODE_ENV === 'development') {
    if (!window['Root']) {
      console.timeEnd('splash')
      const { DevStore } = require('./stores/DevStore')
      const devStore = new DevStore()
      window['Root'] = devStore
    }
  }

  // re-require for hmr to capture new value
  const { RootView } = require('./RootViewHMR')

  // render app
  ReactDOM.render(<RootView />, document.querySelector('#app'))
}

start()

if (process.env.NODE_ENV !== 'production') {
  if (typeof module['hot'] !== 'undefined') {
    module['hot'].accept(start)
  }
}
