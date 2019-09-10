import { configureUI, debug, toColor } from '@o/ui'
import { configureUseStore, debugUseStore, IS_STORE } from '@o/use-store'
import ResizeObserver from 'resize-observer-polyfill'

import { fontProps } from './constants'
import { themes } from './themes'

if (process.env.NODE_ENV === 'development') {
  window['Themes'] = themes
  window['toColor'] = toColor
}

function configure() {
  const hasConfigured = window['hasConfigured']
  window['hasConfigured'] = true
  if (hasConfigured) return

  window['enableLog'] = false
  // @ts-ignore
  window['debug'] = debug

  // required in production
  window['ResizeObserver'] = ResizeObserver

  configureUI({
    defaultProps: {
      title: {
        selectable: true,
        ...fontProps.TitleFont,
      },
    },
  })

  if (process.env.NODE_ENV === 'development') {
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

process.env.NODE_ENV === 'development' && module['hot'] && module['hot'].accept()
