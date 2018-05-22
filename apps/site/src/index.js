import 'regenerator-runtime/runtime'
import 'babel-polyfill'
import 'intersection-observer'
import React from 'react'
import ReactDOM from 'react-dom'
import createElement from '@mcro/black/_/createElement'
import Themes from '~/themes'
import { ThemeProvide } from '@mcro/ui'
import * as Black from '@mcro/black'
import * as Constants from '~/constants'

window.Constants = Constants
// gloss all <tag />s
React.createElement = createElement
window.createElement = createElement

// for hmr clearing
Black.view.on('hmr', main)

function main() {
  const RootNode = document.querySelector('#app')
  const Root = require('./root').default
  ReactDOM.render(
    <ThemeProvide {...Themes}>
      <Root />
    </ThemeProvide>,
    RootNode,
  )
}

main()
