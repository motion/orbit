// @flow
import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import createElement from '@mcro/black/lib/createElement'
import Themes from '~/themes'
import { ThemeProvide } from '@mcro/ui'
import * as Black from '@mcro/black'
import * as UI from '@mcro/ui'

// for hmr clearing
Black.view.on('hmr', main)

// Gloss: all <tag />s can use $$styleProps or css={{}}
React.createElement = createElement

function main() {
  const RootNode = document.querySelector('#app')
  const Root = require('./root').default
  ReactDOM.render(
    <ThemeProvide {...Themes}>
      <UI.Theme name="light">
        <Root />
      </UI.Theme>
    </ThemeProvide>,
    RootNode
  )
}

main()
