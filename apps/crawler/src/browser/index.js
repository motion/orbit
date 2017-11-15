import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import createElement from '@mcro/black/lib/createElement'
import Themes from '~/browser/themes'
import { ThemeProvide } from '@mcro/ui'

// Gloss: all <tag />s can use $$styleProps or css={{}}
React.createElement = createElement

function main() {
  const injectedRoot = document.createElement('div')
  document.body.appendChild(injectedRoot)

  // const shadow = document.body.createShadowRoot()
  // shadow.innerHTML = '<div></div>'
  // const injectedRoot = shadow.children[0]

  const Root = require('./root').default
  ReactDOM.render(
    <ThemeProvide {...Themes}>
      <Root />
    </ThemeProvide>,
    injectedRoot
  )
}

main()
