// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvide } from '@mcro/ui'
import App from '~/app'
import themes from './themes'
import { AppContainer } from 'react-hot-loader'

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
    <AppContainer>
      <ThemeProvide {...themes}>
        <Layout />
      </ThemeProvide>
    </AppContainer>,
    ROOT
  )
  // console.timeEnd('#render')
}

export async function start(quiet, restart) {
  render(restart)
  await App.start(quiet)
  render()
}

start(App.started, App.started)
