import * as React from 'react'
import { view } from '@mcro/black'
import Router from '~/router'
import NotFound from '~/pages/404'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'

@view
export default class Root extends React.Component {
  render() {
    const CurrentPage = Router.activeView || NotFound
    const width = window.innerWidth
    const isSmall = width < Constants.smallSize
    return (
      <UI.Theme name="light">
        <CurrentPage
          width={width}
          isSmall={isSmall}
          key={Router.key}
          {...Router.params}
        />
      </UI.Theme>
    )
  }
}
