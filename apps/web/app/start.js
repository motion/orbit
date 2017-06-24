// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import App from '~/app'
import { ThemeProvide } from 'gloss'
import themes from './theme'
// import { AppContainer } from 'react-hot-loader'

export function render() {
  // console.time('#render')
  const ROOT = document.querySelector('#app')
  const Layout = require('./views/layout').default

  ReactDOM.render(
    <ThemeProvide {...themes}>
      <Layout />
    </ThemeProvide>,
    ROOT
  )
  // console.timeEnd('#render')
}

export async function start() {
  render()
  await App.start()
  render()
}

if (module.hot) {
  module.hot.accept('./views/layout', start)
  module.hot.accept('./router', render)
}

start()
