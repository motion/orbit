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

export function render(shouldReset) {
  // console.time('#render')
  let ROOT = document.querySelector('#app')
  const Layout = require('./views/layout').default

  if (shouldReset && module.hot) {
    log('resetting state fully')
    // HMR: to recover from react bugs
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

export async function start(quiet) {
  render(true)
  await App.start(quiet)
  render()
}

if (module.hot) {
  // module.hot.accept('./views/layout', () => {
  //   log('accept: ./start:./views/layout')
  //   start(true)
  // })
}

log('render: start')
start()
