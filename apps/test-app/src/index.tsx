import '../public/styles/nucleo.css'
import '../public/testBase.css'
import './createElement'
import * as React from 'react'
import ReactDOM from 'react-dom'
import { RootView } from './RootView'

export function render() {
  const RootNode = document.querySelector('#app')
  ReactDOM.render(<RootView />, RootNode)
}

render()

if (process.env.NODE_ENV === 'development') {
  module.hot && module.hot.accept(render)
}
