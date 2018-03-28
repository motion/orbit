import 'regenerator-runtime/runtime'
import './websqlClient'
import { Job } from '@mcro/models'
import { createConnection } from 'typeorm/browser'

window.Job = Job

createConnection({
  type: 'cordova',
  database: 'database',
  location: 'default',
  entities: [Job],
  logging: true,
  synchronize: true,
})
  .then(async connection => {
    console.log('got connection', connection)
  })
  .catch(error => {
    console.log('Error: ', error)
  })

// import 'babel-polyfill'
// import 'isomorphic-fetch'
// import '@mcro/debug/inject'
// import createElement from '@mcro/black/lib/createElement'
// // dont import * as React, we need to overwrite createElement
// import React from 'react'
// import * as Constants from './constants'

// process.on('uncaughtException', err => {
//   console.log('App.uncaughtException', err.stack)
// })

// console.warn(
//   `$ NODE_ENV=${process.env.NODE_ENV} run app ${window.location.pathname}`,
// )

// React.createElement = createElement // any <tag /> can use $$style

// if (Constants.IS_PROD) {
//   require('./helpers/installProd')
// } else {
//   require('./helpers/installDevTools')
// }

// export function start() {
//   console.timeEnd('splash')
//   require('./app')
// }

// start()
