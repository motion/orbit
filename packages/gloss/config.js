// so you can require this before requiring rest of UI kit, so config can be more static

if (process.env.RENDER_TARGET === 'node') {
  exports.configureGloss = require('./_/configureGloss').configureGloss
  exports.configureCSS = require('@o/css').configureCSS
  exports.GlossDefaultConfig = require('./_/configureGloss').GlossDefaultConfig
} else {
  exports.configureGloss = require('./src/configureGloss').configureGloss
  exports.configureCSS = require('@o/css').configureCSS
  exports.GlossDefaultConfig = require('./src/configureGloss').GlossDefaultConfig
}
