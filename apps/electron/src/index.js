import 'source-map-support/register'
import 'isomorphic-fetch'
import 'raf/polyfill'
import './helpers/handlePromiseErrors'
import './helpers/updateChecker'
import './helpers/monitorResourceUsage'
import electronContextMenu from 'electron-context-menu'
import electronDebug from 'electron-debug'
import React from 'react'
import { render } from '@mcro/reactron'
import { throttle } from 'lodash'
import { extras } from 'mobx'

if (process.env.NODE_ENV !== 'production') {
  require('source-map-support/register')
}

// share state because node loads multiple copies
extras.shareGlobalState()

let app = null

const start = throttle(() => {
  const { default: Windows, onWindow } = require('./windows')
  render(<Windows key={Math.random()} />)
  if (!app) {
    electronContextMenu()
    electronDebug()
  }
  onWindow(ref => {
    app = ref
  })
}, 1000)

export default start

if (process.argv.find(x => x === '--start')) {
  start()
}

if (module.hot) {
  // let restarting
  // function restart() {
  //   if (restarting) {
  //     clearTimeout(restarting)
  //   }
  //   app.setState({
  //     restart: true,
  //   })
  //   restarting = setTimeout(start, 1000)
  // }
  // module.hot.accept(restart)
  // module.hot.accept('./windows', restart)
}
