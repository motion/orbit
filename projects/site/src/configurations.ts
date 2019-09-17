import { configureUI } from '@o/ui/config'
import { configureUseStore, debugUseStore, IS_STORE } from '@o/use-store'
import ResizeObserver from 'resize-observer-polyfill'

import * as Constants from './constants'

function configure() {
  const hasConfigured = window['hasConfigured']
  window['hasConfigured'] = true
  if (hasConfigured) return

  // required in production
  window['ResizeObserver'] = ResizeObserver

  // run configureUI first!
  configureUI({
    mediaQueries: Constants.mediaQueries,
    defaultProps: {
      title: {
        selectable: true,
        ...Constants.fontProps.TitleFont,
      },
    },
  })

  // run after configureUI
  if (process.env.NODE_ENV === 'development') {
    window['Themes'] = require('./themes').themes
  }
  window['enableLog'] = false
  // @ts-ignore
  window['debug'] = require('@o/ui').debug

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
