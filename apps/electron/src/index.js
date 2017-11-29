import 'source-map-support/register'
import 'raf/polyfill'
import './helpers/handlePromiseErrors'
import './helpers/updateChecker'
import electronContextMenu from 'electron-context-menu'
import electronDebug from 'electron-debug'
import React from 'react'
import { render } from '@mcro/reactron'
import { throttle } from 'lodash'
import { extras } from 'mobx'

console.log('NODE_ENV', process.env.NODE_ENV)

if (process.env.NODE_ENV !== 'production') {
  require('./helpers/monitorResourceUsage')
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

if (process.env.NODE_ENV === 'production') {
  console.log('STARTING ELECTRON APP')
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
