const app = require('electron').app

console.log(require('electron'))

app.once('ready', () => {
  // bugfix something weird with esm and startup
  // require = require('esm')(module)

  if (process.env.NODE_ENV === 'development') {
    module.exports = require('./_/start-app.js')
  } else {
    module.exports = require('./_/index.js')
  }
})
