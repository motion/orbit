import { configureUseStore, debugUseStore, IS_STORE, themes } from '@o/kit'
import { Theme, ThemeProvide } from '@o/ui'
import ReactDOM from 'react-dom'
import '../public/styles/nucleo.css'
import '../public/testBase.css'

const React = require('react')

export function render() {
  const RootView = require('./RootView').default
  const RootNode = document.querySelector('#app')
  ReactDOM.render(
    <ThemeProvide themes={themes}>
      <Theme name="light">
        <RootView />
      </Theme>
    </ThemeProvide>,
    RootNode,
  )
}

render()

configureUseStore({
  debugStoreState: true,
})

debugUseStore(event => {
  if (event.type === 'state') {
    globalizeStores(event.value)
  } else {
    console.warn('event', event)
  }
})

// hot reloading
if (process.env.NODE_ENV === 'development') {
  if (typeof module['hot'] !== 'undefined') {
    module['hot'].accept(render)
  }
}

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
