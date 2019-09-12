// so you can require this before requiring rest of UI kit, so config can be more static

console.log('RUNNING', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  exports.configureUI = require('./src/helpers/configureUI').configureUI
  exports.configureHotKeys = require('./src/helpers/configureHotKeys').configureHotKeys
} else {
  exports.configureUI = require('./_/helpers/configureUI').configureUI
  exports.configureHotKeys = require('./_/helpers/configureHotKeys').configureHotKeys
}
