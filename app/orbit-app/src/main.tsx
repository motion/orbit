// Be careful not to import anything that depends on getGlobalConfig() here
// we set it up once with setGlobalConfig() and then import the rest of the app

import { getGlobalConfig, GlobalConfig, setGlobalConfig } from '@o/config'
import 'electron'
import * as firebase from 'firebase'
import * as React from 'react'
// @ts-ignore
import { unstable_Profiler as Profiler } from 'react'
import { render } from 'react-dom'
import 'react-hot-loader' // must be imported before react
import '../public/styles/base.css'
import '../public/styles/nucleo.css'
import { IS_ELECTRON } from './constants'
import { sleep } from './helpers'

// initialize firebase
if (firebase && firebase.initializeApp) {
  firebase.initializeApp({
    apiKey: 'AIzaSyD0wuHFVnF7W2B5uPunzittKP4IXwbeROo',
    authDomain: 'orbit-motion-dev.firebaseapp.com',
    databaseURL: 'https://orbit-motion-dev.firebaseio.com',
    projectId: 'orbit-motion-dev',
    storageBucket: 'orbit-motion-dev.appspot.com',
    messagingSenderId: '790826289951',
  })
}

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

  // TODO im just doing this mid-big refactor until we fix it in @o/bridge
  window['GlobalConfig'] = config
}

// setup for app
async function main() {
  // we've already started, ignore
  if (getGlobalConfig()) return

  console.timeEnd('splash')

  await fetchInitialConfig()

  require('./configurations')

  // prevent scroll bounce
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'

  let x = Date.now()
  const { App } = require('@o/stores')
  await App.start()
  if (Date.now() - x > 300) console.log('long start....', Date.now() - x)

  // setup some development helpers
  if (process.env.NODE_ENV === 'development') {
    window['rerender'] = () => {
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
async function startApp(forceRefresh = false) {
  if (forceRefresh) {
    render(<div />, document.querySelector('#app'))
  }
  // re-require for hmr to capture new value
  const { OrbitRoot } = require('./OrbitRoot')

  if (location.search === '?profile') {
    render(
      <Profiler id="Application" onRender={console.log.bind(console)}>
        <OrbitRoot />
      </Profiler>,
      document.querySelector('#app'),
    )
  } else {
    render(<OrbitRoot />, document.querySelector('#app'))
  }
}

// hot reloading
if (process.env.NODE_ENV === 'development') {
  if (typeof module['hot'] !== 'undefined') {
    module['hot'].accept(startApp)
  }
}

main()
