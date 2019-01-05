import '../public/styles/base.css'
import '../public/styles/nucleo.css'
import 'react-hot-loader' // must be imported before react
import { setGlobalConfig, getGlobalConfig } from '@mcro/config'
import { App } from '@mcro/stores'
import { configureUseStore } from '@mcro/use-store'
import { viewEmitter } from '@mcro/black'
import { CompositeDisposable } from 'event-kit'
import { sleep } from './helpers'
import { setupTestApp } from './helpers/setupTestApp'
import * as React from 'react'
import ReactDOM from 'react-dom'

// because for some reason we are picking up electron process.env stuff...
// we want this for web-app because stack traces dont have filenames properly
// see Logger.ts
if (process.env) {
  process.env.STACK_FILTER = 'true'
}

configureUseStore({
  onMount: store => {
    store.subscriptions = new CompositeDisposable()
    if (process.env.NODE_ENV === 'development') {
      viewEmitter.emit('store.mount', { name: store.constructor.name, thing: store })
    }
  },
  onUnmount: store => {
    store.subscriptions.dispose()
    if (process.env.NODE_ENV === 'development') {
      viewEmitter.emit('store.unmount', { name: store.constructor.name, thing: store })
    }
  },
})

async function fetchInitialConfig() {
  // set config before app starts...
  let config
  while (!config) {
    try {
      config = await fetch('/config').then(res => res.json())
    } catch (err) {
      console.log('error getting config, trying again', err)
    }
    // sometimes express can return a partial response for some reason, so lets retry
    if (!config) {
      await sleep(500)
    }
  }
  setGlobalConfig(config)
}

// setup for app
async function main() {
  if (getGlobalConfig()) {
    // we've already started, ignore
    return
  }

  await fetchInitialConfig()

  // prevent scroll bounce
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'

  console.log('start app...')
  await App.start()

  if (process.env.NODE_ENV === 'development') {
    setupTestApp()
  }

  // now run app..
  startApp()
}

// render app
async function startApp() {
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
  ReactDOM.render(React.createElement(OrbitRoot), document.querySelector('#app'))
}

// hot reloading
if (process.env.NODE_ENV === 'development') {
  if (typeof module['hot'] !== 'undefined') {
    module['hot'].accept(startApp)
  }
}

main()
