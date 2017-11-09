// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import Router from '~/router'
import NotFound from '~/views/pages/404'
import * as UI from '@mcro/ui'
import { debounce } from 'lodash'
import * as Constants from '~/constants'

@view
export default class Root extends React.Component {
  lastHeight = window.innerHeight

  state = {
    resizeVersion: 0,
  }

  componentDidMount() {
    this.on(
      window,
      'resize',
      debounce(() => {
        if (window.innerHeight !== this.lastHeight) {
          this.setState({ resizeVersion: ++this.state.resizeVersion })
        }
      }),
      100
    )
  }

  render() {
    const CurrentPage = Router.activeView || NotFound
    const width = window.innerWidth
    const isSmall = width < Constants.smallSize
    return (
      <UI.Theme name="light">
        <layout>
          <content>
            <CurrentPage
              width={width}
              isSmall={isSmall}
              key={Router.key + this.state.resizeVersion}
              {...Router.params}
            />
            <CurrentPage
              if={!isSmall}
              blurred
              key={Router.key + '2' + this.state.resizeVersion}
              {...Router.params}
            />
          </content>
        </layout>
      </UI.Theme>
    )
  }

  static style = {
    layout: {
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
    },
  }
}
