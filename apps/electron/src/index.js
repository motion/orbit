import React from 'react'
import Ionize from '@mcro/ionize'
import Windows, { onWindow } from './windows'

Ionize.start(<Windows />)

let app = null
onWindow(ref => {
  app = ref
})

function restart() {
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
