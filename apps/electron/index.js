const { spawn } = require('child_process')
const startApi = require('@mcro/api').default

// require so it gets bundled
require('./electron')
require('electron')

startApi().then(() => {
  console.log('running electron')
  spawn('./node_modules/.bin/electron', ['./electron.js', '--start'])
})
