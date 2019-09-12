// so you can require this before requiring rest of UI kit, so config can be more static

console.log('RUNNING', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  exports.configureGloss = require('./src/configureGloss').configureGloss
  exports.configureCSS = require('@o/css').configureCSS
  exports.GlossDefaultConfig = require('./src/configureGloss').GlossDefaultConfig
} else {
  exports.configureGloss = require('./_/configureGloss').configureGloss
  exports.configureCSS = require('@o/css').configureCSS
  exports.GlossDefaultConfig = require('./_/configureGloss').GlossDefaultConfig
}
