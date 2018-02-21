// @flow
import 'regenerator-runtime/runtime'
import 'babel-polyfill'
import 'isomorphic-fetch'
import '@mcro/debug/inject'
import createElement from '@mcro/black/lib/createElement'
// dont import * as React, we need to overwrite createElement
import React from 'react'
import * as Constants from './constants'

// $FlowIgnore
React.createElement = createElement // any <tag /> can use $$style

if (Constants.IS_PROD) {
  require('./helpers/installProd')
} else {
  require('./helpers/installDevTools')
}

export function start() {
  console.timeEnd('splash')
  require('./app')
}

start()
