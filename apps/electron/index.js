// const { spawn } = require('child_process')
const startApi = require('@mcro/api').default

console.log('run api')
// startApi().then(() => {
  console.log('run electron')
  console.log(require('./electron')())
  // spawn('./node_modules/.bin/electron', ['./electron.js', '--start'])
// })
