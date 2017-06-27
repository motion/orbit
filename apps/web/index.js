// disable on boot
console.warn = _ => _
require('./src/index')
module.hot && module.hot.accept(_ => _)
