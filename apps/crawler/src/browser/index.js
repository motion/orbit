import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import createElement from '@mcro/black/lib/createElement'
import Themes from '~/browser/themes'
import { ThemeProvide } from '@mcro/ui'

// Gloss: all <tag />s can use $$styleProps or css={{}}
React.createElement = createElement

const injectedRoot = document.createElement('div')

function close() {
  ReactDOM.render(<div />, injectedRoot)
  injectedRoot.parentNode.removeChild(injectedRoot)
}

function main() {
  document.body.appendChild(injectedRoot)
  const Root = require('./root').default
  ReactDOM.render(
    <ThemeProvide {...Themes}>
      <Root onClose={close} />
    </ThemeProvide>,
    injectedRoot
  )
}

main()
