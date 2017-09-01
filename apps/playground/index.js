// @flow
import * as React from 'react'
import ReactDOM from 'react-dom'
import { Theme, ThemeProvide, ThemeMaker } from '@mcro/ui'
import * as Black from '@mcro/black'
import Models from '@mcro/models'
import * as AllModels from '@mcro/models'

window.React = React
window.log = Black.log

const dark = new ThemeMaker().fromColor('#555')

async function render() {
  const Main = require('./playground').default

  const models = new Models(
    {
      name: 'username',
      password: 'password',
      couchUrl: 'api.jot.dev/couch',
      couchHost: 'api.jot.dev',
    },
    AllModels
  )

  await models.start()

  ReactDOM.render(
    <ThemeProvide dark={dark}>
      <Theme name="dark">
        <Main />
      </Theme>
    </ThemeProvide>,
    document.getElementById('app')
  )
}

if (module.hot) {
  module.hot.accept(() => {
    render()
  })
}

render()
