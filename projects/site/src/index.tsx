import 'react-hot-loader' // must be imported before react
import './configurations'

require('./assets/font-gteesti/stylesheet.css')
require('./assets/siteBase.css')

const React = require('react')
const ReactDOM = require('react-dom')

export function render() {
  const RootNode = document.querySelector('#app')
  const { SiteRoot } = require('./SiteRoot')
  ReactDOM.render(<SiteRoot />, RootNode)
}

render()
