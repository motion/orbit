import React from 'react'
import Ionize from '@mcro/ionize'
import Windows, { onWindow } from './windows'

let app = null

console.log('hi')

export default function start() {
  console.log('React', React.version)
  Ionize.start(<Windows />)
  onWindow(ref => {
    app = ref
  })
}

console.log(process.argv, process.argv.find(x => x === '--start'))
if (process.argv.find(x => x === '--start')) {
  console.log('starting')
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
