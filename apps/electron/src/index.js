import 'isomorphic-fetch'
import 'raf/polyfill'
import electronContextMenu from 'electron-context-menu'
import electronDebug from 'electron-debug'
import updater from 'electron-simple-updater'
import React from 'react'
import Ionize from '@mcro/ionize'
import { onWindow } from './windows'
import * as Constants from '~/constants'
import { throttle } from 'lodash'

const ogerror = console.error.bind(console)
console.error = function(...args) {
  if (
    args &&
    typeof args[0] === 'string' &&
    args[0].indexOf('EmojiFunctionRowItem')
  ) {
    return
  }
  return ogerror(...args)
}

let app = null

// update checker
if (Constants.IS_PROD) {
  const updateUrl = require('../package.json').updater.url
  console.log('updateUrl', updateUrl)
  updater.init(updateUrl)

  updater.on('update-available', () => {
    console.log('Update available')
  })

  updater.on('update-downloaded', () => {
    updater.quitAndInstall()
  })
}

const start = throttle(() => {
  const Windows = require('./windows').default
  Ionize.start(<Windows />)

  electronContextMenu()
  electronDebug()

  onWindow(ref => {
    app = ref
  })
}, 1000)

export default start

if (process.argv.find(x => x === '--start')) {
  start()
}

let restarting

function restart() {
  console.log('got a restart from hmr')
  if (restarting) {
    clearTimeout(restarting)
  }
  app.setState(
    {
      restart: true,
    },
    () => {
      restarting = setTimeout(start, 500)
    }
  )
}

if (module.hot) {
  module.hot.accept(restart)
  module.hot.accept('./windows', restart)
}
