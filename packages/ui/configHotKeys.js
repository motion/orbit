if (process.env.RENDER_TARGET === 'node') {
  exports.configureHotKeys = require('./src/helpers/configureHotKeys').configureHotKeys
} else {
  exports.configureHotKeys = require('./_/helpers/configureHotKeys').configureHotKeys
}
