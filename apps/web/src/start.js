// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvide } from '@mcro/ui'
import App from '~/app'
import themes from './themes'
import Container from './views/container'
import Layout from './views/layout'

export function render() {
  // console.time('#render')
  let ROOT = document.querySelector('#app')

  ReactDOM.render(
    <Container>
      <ThemeProvide {...themes}>
        <Layout />
      </ThemeProvide>
    </Container>,
    ROOT
  )
  // console.timeEnd('#render')
}

export async function start(quiet) {
  // render()
  await App.start(quiet)
  render()
}

start(App.started, App.started)
window.start = start

if (module && module.hot) {
  module.hot.accept('./views/layout', () => {
    log('accepted layout')
  })
}
