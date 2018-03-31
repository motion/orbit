exports.store = require('./_/store').default
exports.watch = require('./_/helpers/watch').default
exports.log = require('./_/helpers/log').default
exports.react = exports.watch
Object.assign(exports, require('./_/helpers/mobx'))
