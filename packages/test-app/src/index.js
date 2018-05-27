import './createElement'
import * as React from 'react'
import ReactDOM from 'react-dom'
import Themes from '~/themes'
import { ThemeProvide } from '@mcro/ui'
import * as UI from '@mcro/ui'

function render() {
  const RootNode = document.querySelector('#app')
  const { Root } = require('./root')
  ReactDOM.render(
    <ThemeProvide {...Themes}>
      <UI.Theme name="light">
        <Root />
      </UI.Theme>
    </ThemeProvide>,
    RootNode,
  )
}

render()
