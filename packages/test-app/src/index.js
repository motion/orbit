import '~/../public/styles/nucleo.css'
import '~/../public/testBase.css'
import './createElement'
import * as React from 'react'
import ReactDOM from 'react-dom'
import Themes from '~/themes'
import * as UI from '@mcro/ui'
import { Root } from './root'
import { Gloss } from '@mcro/black'

export function render() {
  Gloss.attach()
  const RootNode = document.querySelector('#app')
  ReactDOM.render(
    <UI.ThemeProvide {...Themes}>
      <UI.Theme name="light">
        <Root />
      </UI.Theme>
    </UI.ThemeProvide>,
    RootNode,
  )
}

render()
