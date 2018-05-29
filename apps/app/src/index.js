import '../public/styles/base.css'
import '../public/styles/nucleo.css'
import './createElement'
// import 'regenerator-runtime/runtime'
import 'isomorphic-fetch'
import '@mcro/debug/inject.js'
import * as Constants from './constants'
import { App } from './app'
import * as UI from '@mcro/ui'
import { ThemeProvide } from '@mcro/ui'
import * as React from 'react'
import ReactDOM from 'react-dom'
import Themes from './themes'
import { debounce } from 'lodash'

import './router'

process.on('uncaughtException', err => {
  console.log('App.uncaughtException', err.stack)
})

if (Constants.IS_PROD) {
  require('./helpers/installProd')
} else {
  require('./helpers/installDevTools')
}

// hmr calls render twice out the gate
// so prevent that
const render = debounce(async () => {
  if (!window.Root) {
    console.warn(`NODE_ENV=${process.env.NODE_ENV} ${window.location.pathname}`)
    console.timeEnd('splash')
    const app = new App()
    window.Root = app
    await app.start()
  }
  console.log('rendering')
  const RootComponent = require('./root').default
  ReactDOM.render(
    <ThemeProvide {...Themes}>
      <UI.Theme name="light">
        <RootComponent />
      </UI.Theme>
    </ThemeProvide>,
    document.querySelector('#app'),
  )
}, 32)

render()

module.hot && module.hot.accept(render)
