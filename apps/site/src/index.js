// @flow
import 'babel-polyfill'
import * as React from 'react'
import ReactDOM from 'react-dom'
import createElement from '@mcro/black/lib/createElement'
import Themes from '~/themes'
import { ThemeProvide } from '@mcro/ui'

// Gloss: all <tag />s can use $$styleProps or css={{}}
React.createElement = createElement

function main() {
  const RootNode = document.querySelector('#app')
  const Root = require('./views/root').default
  ReactDOM.render(
    <ThemeProvide {...Themes}>
      <Root />
    </ThemeProvide>,
    RootNode
  )
}

main()
