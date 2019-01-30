// Be careful not to import anything that depends on getGlobalConfig() here
// we set it up once with setGlobalConfig() and then import the rest of the app

import { debugEmit } from '@mcro/black'
import { getGlobalConfig, GlobalConfig, setGlobalConfig } from '@mcro/config'
import { configureGloss } from '@mcro/gloss'
import { App } from '@mcro/stores'
import { configureUI } from '@mcro/ui'
import { configureUseStore } from '@mcro/use-store'
import { CompositeDisposable } from 'event-kit'
import * as React from 'react'
import ReactDOM from 'react-dom'
import 'react-hot-loader' // must be imported before react
import '../public/styles/base.css'
import '../public/styles/nucleo.css'
import { sleep } from './helpers'
import { Icon } from './views/Icon'

// because for some reason we are picking up electron process.env stuff...
// we want this for web-app because stack traces dont have filenames properly
// see Logger.ts
if (process.env) {
  process.env.STACK_FILTER = 'true'
}

configureGloss({
  pseudoAbbreviations: {
    hoverStyle: '&:hover',
    activeStyle: '&:active',
    focusStyle: '&:focus',
  },
})

configureUI({
  useIcon: Icon,
})

configureUseStore({
  onMount: store => {
    store.subscriptions = new CompositeDisposable()
    if (process.env.NODE_ENV === 'development') {
      debugEmit.emit('store.mount', { name: store.constructor.name, thing: store })
    }
  },
  onUnmount: store => {
    store.subscriptions.dispose()
    if (process.env.NODE_ENV === 'development') {
      debugEmit.emit('store.unmount', { name: store.constructor.name, thing: store })
    }
  },
})

async function fetchInitialConfig() {
  // set config before app starts...
  let config: GlobalConfig
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
  // we've already started, ignore
  if (getGlobalConfig()) return

  console.timeEnd('splash')

  await fetchInitialConfig()

  // prevent scroll bounce
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'

  let x = Date.now()
  await App.start()
  if (Date.now() - x > 200) console.log('long start....', Date.now() - x)

  if (process.env.NODE_ENV === 'development') {
    require('./helpers/setupTestApp').setupTestApp()
    const { DevStore } = require('./stores/DevStore')
    const devStore = new DevStore()
    devStore['rerender'] = startApp
    window['Root'] = devStore
  }

  // now run app..
  startApp()
}

// render app
async function startApp() {
  // re-require for hmr to capture new value
  const { OrbitRoot } = require('./OrbitRoot')
  ReactDOM.render(<OrbitRoot />, document.querySelector('#app'))
}

// hot reloading
if (process.env.NODE_ENV === 'development') {
  if (typeof module['hot'] !== 'undefined') {
    module['hot'].accept(startApp)
  }
}

main()
