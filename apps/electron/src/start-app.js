import 'source-map-support/register'
import 'raf/polyfill'
import './helpers/handlePromiseErrors'
import './helpers/updateChecker'
import electronContextMenu from 'electron-context-menu'
import electronDebug from 'electron-debug'
import React from 'react'
import { render } from '@mcro/reactron'
import { extras } from 'mobx'
import Root from './views/root'

if (process.env.NODE_ENV !== 'production') {
  require('./helpers/monitorResourceUsage')
  require('source-map-support/register')
}

// share state because node loads multiple copies
extras.shareGlobalState()

let started = false

export function start() {
  if (started) return
  started = true
  console.log('starting electron', process.env.NODE_ENV)
  render(<Root />)
  electronContextMenu()
  electronDebug()
}

if (process.env.NODE_ENV === 'development') {
  start()
}
