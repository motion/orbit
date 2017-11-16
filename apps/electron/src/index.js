import 'isomorphic-fetch'
import 'raf/polyfill'
import './helpers/handlePromiseErrors'
import './helpers/updateChecker'
import './helpers/monitorResourceUsage'
import electronContextMenu from 'electron-context-menu'
import electronDebug from 'electron-debug'
import React from 'react'
import Ionize from '@mcro/ionize'
import { onWindow } from './windows'
import { throttle } from 'lodash'
import { extras } from 'mobx'

// share state because node loads multiple copies
extras.shareGlobalState()

let app = null

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
  // for now
  process.exit()
  // if (restarting) {
  //   clearTimeout(restarting)
  // }
  // app.setState(
  //   {
  //     restart: true,
  //   },
  //   () => {
  //     restarting = setTimeout(start, 1000)
  //   }
  // )
}

if (module.hot) {
  module.hot.accept(restart)
  module.hot.accept('./windows', restart)
}
