import 'regenerator-runtime/runtime'
import 'babel-polyfill'
import 'isomorphic-fetch'
import '@mcro/debug/inject'
import createElement from '@mcro/black/lib/createElement'
// dont import * as React, we need to overwrite createElement
import React from 'react'
import * as Constants from './constants'

process.on('uncaughtException', err => {
  console.log('App.uncaughtException', err.stack)
})

React.createElement = createElement // any <tag /> can use $$style

if (Constants.IS_PROD) {
  require('./helpers/installProd')
} else {
  require('./helpers/installDevTools')
}

export async function start() {
  if (!window.Root) {
    console.warn(`NODE_ENV=${process.env.NODE_ENV} ${window.location.pathname}`)
    console.timeEnd('splash')
  }
  console.log('---', window.regneratorRuntime)
  await new Promise(r => setTimeout(r, 20))
  require('./app')
}

start()
