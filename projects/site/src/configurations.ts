import 'requestidlecallback-polyfill'

import { ThemeMaker } from '@o/gloss'
import { configureHotKeys, configureUI, toColor } from '@o/ui'
import { configureUseStore, debugUseStore, IS_STORE } from '@o/use-store'
import { setConfig } from 'react-hot-loader'
import ResizeObserver from 'resize-observer-polyfill'

import { ResizeSensor } from './pages/DocsPage/ResizeSensor'
import { themes } from './themes'

if (process.env.NODE_ENV === 'development') {
  window['Themes'] = themes
  window['toColor'] = toColor
  window['ThemeMaker'] = new ThemeMaker()
}

function configure() {
  const hasConfigured = window['hasConfigured']
  window['hasConfigured'] = true
  if (hasConfigured) return

  // required in production
  window['ResizeObserver'] = ResizeObserver
  window['ResizeSensor'] = ResizeSensor

  configureUI({
    defaultProps: {
      title: {
        selectable: true,
        fontFamily: 'GT Eesti',
        className: 'font-smooth',
      },
    },
  })

  configureHotKeys({
    ignoreTags: [],
  })

  if (process.env.NODE_ENV === 'development') {
    // just for now since its spitting out so many
    setConfig({
      logLevel: 'no-errors-please',
      pureSFC: true,
      pureRender: true,
      // disableHotRenderer: true,
    })

    // dev tools for stores
    configureUseStore({
      debugStoreState: true,
    })

    debugUseStore(event => {
      if (event.type === 'state') {
        globalizeStores(event.value)
      }
    })

    function globalizeStores(stores: Object) {
      window['Stores'] = stores
      // if we can, put store right on window
      for (const key in stores) {
        if (window[key]) {
          if (Array.isArray(window[key]) && !window[key][0][IS_STORE]) return
          if (!window[key][IS_STORE]) return
          window[key] = stores[key]
        } else {
          window[key] = stores[key]
        }
      }
    }
  }
}

configure()

if (module['hot']) {
  module['hot'].accept()
}
