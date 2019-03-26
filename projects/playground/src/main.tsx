import { themes } from '@o/kit'
import { Theme, ThemeProvide } from '@o/ui'
import ReactDOM from 'react-dom'
import '../public/styles/nucleo.css'
import '../public/testBase.css'

const React = require('react')

export function render() {
  const RootView = require('./RootView').default
  const RootNode = document.querySelector('#app')
  ReactDOM.render(
    <ThemeProvide themes={themes}>
      <Theme name="light">
        <RootView />
      </Theme>
    </ThemeProvide>,
    RootNode,
  )
}

render()

// hot reloading
if (process.env.NODE_ENV === 'development') {
  if (typeof module['hot'] !== 'undefined') {
    module['hot'].accept(render)
  }
}
