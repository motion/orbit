import 'react-hot-loader' // must be imported before react
import './../public/styles/siteBase.css'
import * as React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvide, Theme } from '@mcro/ui'
import { themes } from './etc/themes'

export function render() {
  const RootNode = document.querySelector('#app')
  const { SiteRoot } = require('./SiteRoot')
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
