// @flow
import * as React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvide } from '@mcro/ui'
import App from '~/app'
import themes from './themes'
import Root from './views/root'
import Layout from './views/layout'

export function render() {
  console.time('#render')
  let ROOT = document.querySelector('#app')
  console.log('waht is layout', Layout)
  ReactDOM.render(
    <Root>
      <ThemeProvide {...themes}>
        <Layout />
      </ThemeProvide>
    </Root>,
    ROOT
  )
  console.timeEnd('#render')
}

export async function start(quiet) {
  // render()
  await App.start(quiet)
  render()
}

start(App.started, App.started)
window.start = start
