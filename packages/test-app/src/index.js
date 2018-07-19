import '~/../public/styles/nucleo.css'
import '~/../public/testBase.css'
import './createElement'
import * as React from 'react'
import ReactDOM from 'react-dom'
import Themes from '~/themes'
import { ThemeProvide, Theme } from '@mcro/gloss'
import { Root } from './root'

export function render() {
  const RootNode = document.querySelector('#app')
  ReactDOM.render(
    <ThemeProvide {...Themes}>
      <Theme name="light">
        <Root />
      </Theme>
    </ThemeProvide>,
    RootNode,
  )
}

render()
