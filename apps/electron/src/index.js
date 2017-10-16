import electronContextMenu from 'electron-context-menu'
import electronDebug from 'electron-debug'
import updater from 'electron-simple-updater'
import React from 'react'
import Ionize from '@mcro/ionize'
import Windows, { onWindow } from './windows'
import * as Constants from '~/constants'

let app = null

electronContextMenu()
electronDebug()

// update checker
if (Constants.IS_PROD) {
  const updateUrl = require('../package.json').updater.url
  console.log('updateUrl', updateUrl)
  updater.init(updateUrl)
}

export default function start() {
  Ionize.start(<Windows />)
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
    () => {
      const Windows = require('./windows').default

      setTimeout(() => {
        //Ionize.reset()
        Ionize.update(<Windows />)
        console.log('did hmr')
      }, 500)
    }
  )
}

if (module.hot) {
  module.hot.accept(restart)
  module.hot.accept('./windows', restart)
}
