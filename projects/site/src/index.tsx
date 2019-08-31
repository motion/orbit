import './assets/font-colfax/stylesheet.css'
import './assets/font-gteesti/stylesheet.css'
import './assets/siteBase.css'
import 'react-hot-loader'
import 'requestidlecallback-polyfill'

// import after react-hot-loader, order important
require('./configurations')
require('./startSite')

process.env.NODE_ENV === 'development' && module['hot'] && module['hot'].accept()
