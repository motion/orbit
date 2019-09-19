// so you can require this before requiring rest of UI kit, so config can be more static

if (process.env.RENDER_TARGET === 'node') {
  exports.configureUI = require('./src/helpers/configureUI').configureUI
} else {
  exports.configureUI = require('./_/helpers/configureUI').configureUI
}
