import { Icon, themes } from '@o/kit'
import { configureUI, Theme, ThemeProvide } from '@o/ui'
import * as React from 'react'
import ReactDOM from 'react-dom'
import 'react-hot-loader' // must be imported before react
import './../public/styles/siteBase.css'

configureUI({
  useIcon: Icon,
})

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
