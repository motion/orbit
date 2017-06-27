// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import App from '~/app'
import { ThemeProvide } from 'gloss'
import themes from './theme'

import { view } from '@jot/black'

@view
class Test {
  render() {
    return <div>null</div>
  }
}

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

export async function start(quiet) {
  render()
  await App.start(quiet)
  render()
}

if (module.hot) {
  module.hot.accept('./views/layout', () => start(true))
  module.hot.accept('./router', render)
}

start()
