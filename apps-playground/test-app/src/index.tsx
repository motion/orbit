import '../public/styles/nucleo.css'
import '../public/testBase.css'
import 'react-hot-loader'
import * as React from 'react'
import ReactDOM from 'react-dom'
import './RootViewHMR'

export function render() {
  const { RootView } = require('./RootViewHMR')
  const RootNode = document.querySelector('#app')
  ReactDOM.render(<RootView />, RootNode)
}

render()

if (process.env.NODE_ENV === 'development') {
  module.hot && module.hot.accept(render)
}
