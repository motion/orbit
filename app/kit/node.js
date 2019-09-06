const m = require('./_/index')
if (!global.require.__islaxied) {
  const laxy = require('laxy')
  global.require = laxy(require)
  global.require.__islaxied = true
}
for (var p in m) {
  if (!exports.hasOwnProperty(p)) exports[p] = m[p]
}
