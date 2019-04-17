import 'react-hot-loader' // must be imported before react
import './assets/font-gteesti/stylesheet.css'
import './assets/siteBase.css'
import './configurations'

const React = require('react')
const ReactDOM = require('react-dom')

export function render() {
  const RootNode = document.querySelector('#app')
  const { SiteRoot } = require('./SiteRoot')
  ReactDOM.render(<SiteRoot />, RootNode)
}

render()
