import './assets/font-gteesti/stylesheet.css'
import './assets/siteBase.css'
import 'react-hot-loader'

import { SiteRoot } from './SiteRoot'

require('./configurations')
const React = require('react')
const ReactDOM = require('react-dom')

export function render() {
  const RootNode = document.querySelector('#app')

  if (window.location.search.indexOf('react.concurrent') > 0) {
    ReactDOM.unstable_createRoot(RootNode).render(
      <React.unstable_ConcurrentMode>
        <SiteRoot />,
      </React.unstable_ConcurrentMode>,
    )
  } else {
    ReactDOM.render(<SiteRoot />, RootNode)
  }
}

render()

window['render'] = render

if (module['hot']) {
  module['hot'].accept()
}
