// import './assets/font-colfax/stylesheet.css'
import './assets/font-gteesti/stylesheet.css'
import './assets/siteBase.css'
import 'requestidlecallback-polyfill'

require('array.prototype.flatmap').shim()
require('react-dom') // ensure hmr patch applied
require('./configurations')
require('./startSite')

process.env.NODE_ENV === 'development' && module['hot'] && module['hot'].accept()
