// @flow
import 'babel-polyfill'
import 'isomorphic-fetch'
import createElement from '@mcro/black/lib/createElement'
// dont import * as React, we need to overwrite createElement
import React from 'react'
import * as Constants from './constants'
import debug from 'debug'

// $FlowIgnore
React.createElement = createElement // any <tag /> can use $$style

if (Constants.IS_PROD) {
  require('./helpers/installProd')
} else {
  require('./helpers/installDevTools')
}

const DEBUG_FLAG = localStorage.getItem('debug') || 'app,sync,model'
debug.enable(DEBUG_FLAG)

export function start() {
  console.timeEnd('splash')
  require('./app')
}

start()
