import 'source-map-support/register'
import 'raf/polyfill'
import './helpers/handlePromiseErrors'
import './helpers/updateChecker'
import electronContextMenu from 'electron-context-menu'
import electronDebug from 'electron-debug'
import React from 'react'
import { render } from '@mcro/reactron'
import { extras } from 'mobx'

if (process.env.NODE_ENV !== 'production') {
  require('./helpers/monitorResourceUsage')
  require('source-map-support/register')
}

// share state because node loads multiple copies
extras.shareGlobalState()

let app = null

export function start() {
  console.log('starting electron', process.env.NODE_ENV)
  const { default: Windows, onWindow } = require('./windows')
  render(<Windows key={Math.random()} />)
  if (!app) {
    electronContextMenu()
    electronDebug()
  }
  onWindow(ref => {
    app = ref
  })
}
