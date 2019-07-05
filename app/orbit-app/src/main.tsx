import '../public/styles/base.css'
import 'react-hot-loader'

import { getGlobalConfig, GlobalConfig, setGlobalConfig } from '@o/config'

import { IS_ELECTRON } from './constants'
import { sleep } from './helpers'

// Be careful not to import anything that depends on getGlobalConfig() here
// we set it up once with setGlobalConfig() and then import the rest of the app
// @ts-ignore
if (IS_ELECTRON) {
  require('electron')
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

  // until resolved: https://github.com/webpack-contrib/webpack-hot-middleware/pull/362
  console.group = console.groupCollapsed

  console.timeEnd('splash')

  if (window.location.search.indexOf('why') > -1) {
    const whyDidYouRender = require('@welldone-software/why-did-you-render').default
    whyDidYouRender(React, {
      // turn on to log ONLY when things rendered without needing to
      // logOnDifferentValues: true,
      include: [
        // turn on to log just about everything
        // /[A-Z][a-zA-Z]+/,
        // turn on to log main orbit areas + expensive views only
        /App|Orbit|Demo|Header/,
      ],
      // seems like classes dont work (transpiled probably similar to error: https://github.com/maicki/why-did-you-update/issues/47)
      exclude: [
        /ErrorBoundary|Sidebar|Interactive|Portal|Text|Popover|SuspenseWithBanner|ItemMeasurer|VirtualListItemInner|SortableGridItem|TimeAgo/,
      ],
    })
  }

  // if you want to show a loading screen, do it above here

  await fetchInitialConfig()

  // start cross-process stores
  console.time('loadStores')
  const { App } = require('@o/stores')
  await App.start()
  console.timeEnd('loadStores')

  // prevent scroll bounce
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'

  // start om first so it inits before showing
  console.time('loadOm')
  const { om } = require('./om/om')
  await om.initialized
  console.timeEnd('loadOm')

  // install dev tools
  require('./helpers/installDevelopmentHelpers')

  // now run app..
  console.time('startApp')
  startApp()
  console.timeEnd('startApp')
}

// helper for force-rerender
window['rerender'] = () => {
  startApp(true)
}

const React = require('react')
const ReactDOM = require('react-dom')

// render app
async function startApp(forceRefresh = false) {
  const RootNode = document.querySelector('#app')

  if (forceRefresh) {
    ReactDOM.render(<div />, RootNode)
  }

  // re-require for hmr to capture new value
  const { OrbitRoot } = require('./OrbitRoot')

  let elements = <OrbitRoot />

  if (window.location.search.indexOf('react.profile') > 0) {
    elements = (
      <React.unstable_Profiler id="Application" onRender={console.log.bind(console)}>
        {elements}
      </React.unstable_Profiler>
    )
  }

  if (window.location.search.indexOf('react.concurrent') > 0) {
    ReactDOM.unstable_createRoot(RootNode).render(
      <React.unstable_ConcurrentMode>{elements},</React.unstable_ConcurrentMode>,
    )
  } else {
    ReactDOM.render(elements, RootNode)
  }
}

// hot reloading
if (process.env.NODE_ENV === 'development') {
  if (typeof module['hot'] !== 'undefined') {
    module['hot'].accept(startApp)
  }
}

main()

if (module['hot']) {
  module['hot'].accept(() => {
    console.log('accepted root')
  })
}
