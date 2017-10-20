// disable on boot
// console.warn = _ => _
import './src/index'
module.hot && module.hot.accept(() => {})
