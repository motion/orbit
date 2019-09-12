// so you can require this before requiring rest of UI kit, so config can be more static

exports.configureGloss = require('./src/configureGloss').configureGloss
exports.configureCSS = require('@o/css').configureCSS
exports.GlossDefaultConfig = require('./src/configureGloss').GlossDefaultConfig
