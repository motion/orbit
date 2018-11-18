import '../public/testBase.css'
import ReactDOM from 'react-dom'
import React from 'react'
import { CosalDebug } from './CosalDebug'

export function render() {
  const RootNode = document.querySelector('#app')
  ReactDOM.render(<CosalDebug />, RootNode)
}

render()
