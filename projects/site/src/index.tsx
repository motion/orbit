import 'react-hot-loader' // must be imported before react
import ResizeObserver from 'resize-observer-polyfill'
import './../public/font/stylesheet.css'
import './../public/styles/siteBase.css'
import './configurations'

window['ResizeObserver'] = ResizeObserver

const React = require('react')
const ReactDOM = require('react-dom')

export function render() {
  const RootNode = document.querySelector('#app')
  const { SiteRoot } = require('./SiteRoot')
  ReactDOM.render(<SiteRoot />, RootNode)
}

render()
