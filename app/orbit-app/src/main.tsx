import '../public/styles/base.css'

/**
 *  ⚠️    ⚠️    ⚠️    ⚠️    ⚠️    ⚠️
 *
 *     Don't import here directly
 *       (order here important)
 *
 *  ⚠️    ⚠️    ⚠️    ⚠️    ⚠️    ⚠️
 */

/**
 *
 * Note: we're using custom react/react-dom that lets you move between prod/dev.
 *
 * Please don't import anything else above this, be careful.
 *
 * Before we load it, we load in dev mode, then switch back into whatever mode were in. Be sure this is the first time react/react-dom are loaded
 *
 */
window['__DEV__'] = true
// https://github.com/facebook/react/issues/16604
if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  const runtime = require('react-refresh/runtime')
  runtime.injectIntoGlobalHook(window)
  window['$RefreshReg$'] = () => {}
  window['$RefreshSig$'] = () => type => type
}
const React = require('react')
const ReactDOM = require('react-dom')

const { getGlobalConfig, setGlobalConfig } = require('@o/config')
const { IS_ELECTRON } = require('./constants')
const { sleep } = require('./helpers')

const SearchOptions = {
  profile: window.location.search.includes('react.profile'),
  concurrent: window.location.search.includes('react.concurrent'),
}
console.warn(
  'TODO enable prod mode with new electron (see yarn start NODE_ENV)',
  process.env.NODE_ENV,
)
/**
 * Warning: I ran into a bug importing @/kit or @/ui here (or anything from the base DLL)
 * It causes many imports that shouldn't be undefined to be undefined.
 */

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
  let config = null
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

// helper for force-rerender
window['rerender'] = (force = true) => {
  startApp(force)
}

// setup for app
async function main() {
  // we've already started, ignore
  if (getGlobalConfig()) return

  // if you want to show a loading screen, do it above here
  await fetchInitialConfig()

  // until resolved: https://github.com/webpack-contrib/webpack-hot-middleware/pull/362
  console.group = console.groupCollapsed

  console.timeEnd('splash')

  // ?why
  if (window.location.search.indexOf('why') > -1) {
    const whyDidYouRender = require('@welldone-software/why-did-you-render').default
    const React = require('react')
    const match = window.location.search.match(/why=([a-z0-9_]+)/i)
    const include = match && match.length === 2 ? match[1] : 'App|Orbit|Demo|Header'
    const includeMatch = include === 'all' ? /[A-Z][a-zA-Z]+/ : new RegExp(include, 'i')
    whyDidYouRender(React, {
      // turn on to log ONLY when things rendered without needing to
      // logOnDifferentValues: true,
      include: [includeMatch],
      // seems like classes dont work (transpiled probably similar to error: https://github.com/maicki/why-did-you-update/issues/47)
      exclude: [
        /Geometry|ErrorBoundary|Sidebar|Interactive|Portal|Text|Popover|SuspenseWithBanner|ItemMeasurer|VirtualListItemInner|SortableGridItem|TimeAgo/,
      ],
    })
  }

  // start cross-process stores
  // console.time('loadStores')
  const { App } = require('@o/stores')
  await App.start()
  // console.timeEnd('loadStores')

  // install dev tools
  require('./helpers/installDevTools')

  // prevent scroll bounce
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'

  // start om first so it inits before showing
  // console.time('loadOm')
  const { createOvermind } = require('overmind')
  const { config } = require('./om/om')
  const om = createOvermind(config, {
    logProxies: true,
  })

  // for now we are hacking around overmind
  window['om'] = om

  await om.initialized
  // console.timeEnd('loadOm')

  // now run app..
  startApp()
}

// render app
async function startApp(forceRefresh: boolean | 'mode' = false) {
  let RootNode = document.querySelector('#app')

  if (forceRefresh === 'mode') {
    document.body.removeChild(RootNode!)
    const div = document.createElement('div')
    div.id = 'app'
    document.body.appendChild(div)
    RootNode = document.querySelector('#app')
  }

  if (forceRefresh) {
    ReactDOM.render(<div />, RootNode)
  }

  // re-require for hmr to capture new value
  const { OrbitRoot } = require('./OrbitRoot')
  const { Provider } = require('overmind-react')
  let elements = (
    <Provider value={window['om']}>
      <OrbitRoot />
    </Provider>
  )

  if (SearchOptions.profile) {
    elements = (
      <React.unstable_Profiler id="Application" onRender={console.log.bind(console)}>
        {elements}
      </React.unstable_Profiler>
    )
  }

  if (SearchOptions.concurrent) {
    console.warn('Concurrent mode enabled')
    ReactDOM.unstable_createRoot(RootNode).render(elements)
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
