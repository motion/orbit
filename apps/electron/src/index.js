import React from 'react'
import Ionize from '@mcro/ionize'
import Windows, { onWindow } from './windows'

Ionize.start(<Windows />)

let app = null

onWindow(ref => {
  app = ref
})

if (module.hot) {
  module.hot.accept('./windows', () => {
    app.setState({
      restart: true,
    })

    const Windows = require('./windows').default
    Ionize.reset()
    Ionize.start(<Windows />)
    console.log('did hmr')
  })
}
