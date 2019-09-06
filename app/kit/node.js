const m = require('./_/index')
if (!global.require.__proxiedRequire) {
  const laxy = require('laxy')
  global.require = laxy(require)
  global.require.__proxiedRequire = true
}
for (var p in m) {
  if (!exports.hasOwnProperty(p)) exports[p] = m[p]
}
