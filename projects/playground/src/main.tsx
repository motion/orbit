import '../public/testBase.css'

import { configureUseStore, themes } from '@o/kit'
import { ProvideUI } from '@o/ui'
import ReactDOM from 'react-dom'

const React = require('react')

export function render() {
  const RootView = require('./RootView').default
  const RootNode = document.querySelector('#app')
  const element = (
    <ProvideUI activeTheme="light" themes={themes}>
      <RootView />
    </ProvideUI>
  )
  if (window.location.search.indexOf('react.concurrent') > 0) {
    ReactDOM.unstable_createRoot(RootNode).render(
      <React.unstable_ConcurrentMode>{element}</React.unstable_ConcurrentMode>,
    )
  } else {
    ReactDOM.render(element, RootNode)
  }
}

render()

configureUseStore({
  debugStoreState: true,
})

// hot reloading
if (process.env.NODE_ENV === 'development') {
  if (typeof module['hot'] !== 'undefined') {
    module['hot'].accept(render)
  }
}

// debugUseStore(event => {
//   if (event.type === 'state') {
//     globalizeStores(event.value)
//   } else {
//     console.warn('event', event)
//   }
// })

// function globalizeStores(stores: Object) {
//   window['Stores'] = stores
//   // if we can, put store right on window
//   for (const key in stores) {
//     if (window[key]) {
//       if (Array.isArray(window[key]) && !window[key][0][IS_STORE]) return
//       if (!window[key][IS_STORE]) return
//       window[key] = stores[key]
//     } else {
//       window[key] = stores[key]
//     }
//   }
// }
