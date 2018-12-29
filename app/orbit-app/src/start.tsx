// TODO can we collapse this down to main

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
  const { OrbitRoot } = require('./OrbitRoot')

  // render app
  ReactDOM.render(<OrbitRoot />, document.querySelector('#app'))
}

start()

if (process.env.NODE_ENV !== 'production') {
  if (typeof module['hot'] !== 'undefined') {
    module['hot'].accept(start)
  }
}
