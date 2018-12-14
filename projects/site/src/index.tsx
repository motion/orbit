import './../public/styles/siteBase.css'
import * as React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvide, Theme } from '@mcro/ui'
import { themes } from './etc/themes'

function render() {
  const RootNode = document.querySelector('#app')
  const SiteRoot = require('./SiteRootHMR').default
  ReactDOM.render(
    <ThemeProvide themes={themes}>
      <Theme name="light">
        <SiteRoot />
      </Theme>
    </ThemeProvide>,
    RootNode,
  )
}

render()

if (module['hot']) {
  module['hot'].accept(render)
}
