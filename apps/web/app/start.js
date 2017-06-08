// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import App from '~/app'
import Router from '~/router'
import { IS_PROD, DB_CONFIG } from './constants'
import { ThemeProvide } from 'gloss'
import themes from './theme'

// dev tools
if (!IS_PROD) {
  require('./helpers/installDevTools')
}

// import serviceWorker from './helpers/serviceWorker'
// serviceWorker()

const ROOT = document.querySelector('#app')

export function render() {
  console.time('#render')
  const Root = require('./views/root').default
  ReactDOM.render(
    <ThemeProvide {...themes}>
      <Root />
    </ThemeProvide>,
    ROOT
  )
  console.timeEnd('#render')
}

export async function start() {
  await App.start()
  render()
}

if (module && module.hot) {
  module.hot.accept('./views/root', render)
  module.hot.accept('./router', render)
}

start()
