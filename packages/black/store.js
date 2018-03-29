exports.store = require('./es6/store').default
exports.watch = require('./es6/helpers/watch').default
exports.log = require('./es6/helpers/log').default
exports.react = exports.watch
Object.assign(exports, require('./es6/helpers/mobx'))
