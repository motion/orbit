// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvide } from '@mcro/ui'
import App from '~/app'
import themes from './theme'

start(App.started, App.started)

export function render(shouldReset) {
  // console.time('#render')
  let ROOT = document.querySelector('#app')
  const Layout = require('./views/layout').default

  // HMR: to recover from react bugs save this file
  if (shouldReset && module.hot) {
    const parent = ROOT.parentNode
    parent.removeChild(ROOT)
    ROOT = document.createElement('div')
    ROOT.setAttribute('id', 'app')
    document.body.appendChild(ROOT)
  }

  ReactDOM.render(
    <ThemeProvide {...themes}>
      <Layout />
    </ThemeProvide>,
    ROOT
  )
  // console.timeEnd('#render')
}

export async function start(quiet, restart) {
  log(`start(${quiet}, ${restart})`)
  render(restart)
  await App.start(quiet)
  render()
}
