import '../public/styles/nucleo.css'
import '../public/testBase.css'
import ReactDOM from 'react-dom'
import './RootViewHMR'
import { debugState } from '@mcro/black'

debugState(({ stores }) => {
  window['x'] = stores
})

const React = require('react')

export function render() {
  const { RootView } = require('./RootViewHMR')
  const RootNode = document.querySelector('#app')
  ReactDOM.render(<RootView />, RootNode)
}

render()
