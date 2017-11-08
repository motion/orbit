import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import createElement from '@mcro/black/lib/createElement'
import Themes from '~/browser/themes'
import { ThemeProvide, Theme } from '@mcro/ui'

// Gloss: all <tag />s can use $$styleProps or css={{}}
React.createElement = createElement

function main() {
  const injectedRoot = document.createElement('div')
  document.body.appendChild(injectedRoot)
  const Root = require('./root').default
  ReactDOM.render(
    <ThemeProvide {...Themes}>
      <Theme name="dark">
        <Root />
      </Theme>
    </ThemeProvide>,
    injectedRoot
  )
}

main()
