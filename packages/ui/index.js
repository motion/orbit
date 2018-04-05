'use strict'

console.log('hi')

if (!module.hot || process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/index.js')
} else {
  module.exports = require('./lib/index.js')
}
