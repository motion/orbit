const app = require('electron').app

// bugfix something weird with esm and startup
app.once('ready', () => {
  require = require('esm')(module)
  module.exports = require('./_/index.js')
})
