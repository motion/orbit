// @flow
import 'babel-polyfill'
import * as React from 'react'
import ReactDOM from 'react-dom'
import createElement from '@mcro/black/lib/createElement'
import Themes from '~/themes'
import Root from '~/views/root'
import { ThemeProvide } from '@mcro/ui'

// Gloss: all <tag />s can use $$styleProps or css={{}}
React.createElement = createElement

function main() {
  let ROOT = document.querySelector('#app')
  ReactDOM.render(
    <ThemeProvide {...Themes}>
      <Root />
    </ThemeProvide>,
    ROOT
  )
}

main()
