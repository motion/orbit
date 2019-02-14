// Be careful not to import anything that depends on getGlobalConfig() here
// we set it up once with setGlobalConfig() and then import the rest of the app

import { IS_ELECTRON } from '@mcro/black/_/constants'
import { getGlobalConfig, GlobalConfig, setGlobalConfig } from '@mcro/config'
import { App } from '@mcro/stores'
import * as React from 'react'
import ReactDOM from 'react-dom'
import 'react-hot-loader' // must be imported before react
import '../public/styles/base.css'
import '../public/styles/nucleo.css'
import './configurations'
import { sleep } from './helpers'

// because for some reason we are picking up electron process.env stuff...
// we want this for web-app because stack traces dont have filenames properly
// see Logger.ts
if (process.env) {
  process.env.STACK_FILTER = 'true'
}

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

  // setup some development helpers
  if (process.env.NODE_ENV === 'development') {
    const { DevStore } = require('./stores/DevStore')
    const devStore = new DevStore()
    window['Root'] = devStore
    devStore['rerender'] = () => {
      startApp(true)
    }
  }

  // setup test app if needed
  const testAppMatch = window.location.search
    ? window.location.search.match(/testAppId=([a-z]+)/)
    : null
  if (process.env.NODE_ENV === 'development' && !IS_ELECTRON && testAppMatch) {
    console.log('testing app, testAppMatch', testAppMatch[1])
    require('./helpers/setupTestApp').setupTestApp(testAppMatch[1])
  }

  // now run app..
  startApp()
}

// render app
async function startApp(force = false) {
  if (force) {
    ReactDOM.render(<div />, document.querySelector('#app'))
  }
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
