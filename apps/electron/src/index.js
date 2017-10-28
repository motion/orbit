import electronContextMenu from 'electron-context-menu'
import electronDebug from 'electron-debug'
import updater from 'electron-simple-updater'
import React from 'react'
import Ionize from '@mcro/ionize'
import { onWindow } from './windows'
import * as Constants from '~/constants'

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

export default function start() {
  const Windows = require('./windows').default
  Ionize.start(<Windows />)

  electronContextMenu()
  electronDebug()

  onWindow(ref => {
    app = ref
  })
}

if (process.argv.find(x => x === '--start')) {
  start()
}

function restart() {
  console.log('got a restart from hmr')
  app.setState(
    {
      restart: true,
    },
    () => setTimeout(start, 500)
  )
}

if (module.hot) {
  module.hot.accept(restart)
  module.hot.accept('./windows', restart)
}
