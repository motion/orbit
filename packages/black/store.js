exports.store = require('./lib/store').default
exports.watch = require('./lib/helpers/watch').default
exports.log = require('./lib/helpers/log').default
exports.react = exports.watch
Object.assign(exports, require('./lib/helpers/mobx'))
