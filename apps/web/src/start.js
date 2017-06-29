// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvide } from '@mcro/ui'
import { view } from '@mcro/black'
import App from '~/app'
import themes from './theme'

@view
class Test {
  render() {
    log(this.gloss({ boxShadow: ['inset', 0, 10, 10, [0, 0, 0, 0.1]] }))
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
  module.hot.accept('./views/layout', () => {
    log('accept: ./start:./views/layout')
    start(true)
  })
}

log('render: start')
start()
