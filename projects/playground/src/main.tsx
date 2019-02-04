import { debugState } from '@mcro/black'
import ReactDOM from 'react-dom'
import '../public/styles/nucleo.css'
import '../public/testBase.css'

debugState(({ stores }) => {
  window['stores'] = stores
  console.log('stores', stores)
})

const React = require('react')

export function render() {
  const RootView = require('./RootView').default
  const RootNode = document.querySelector('#app')
  ReactDOM.render(<RootView />, RootNode)
}

render()
