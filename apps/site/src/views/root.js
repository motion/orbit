// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import Router from '~/router'
import NotFound from '~/views/pages/404'
import Header from '~/views/header'
import * as UI from '@mcro/ui'
import { debounce } from 'lodash'

@view
export default class Root extends React.Component {
  state = {
    resizeVersion: 0,
  }

  componentDidMount() {
    this.on(
      window,
      'resize',
      debounce(() => {
        this.setState({ resizeVersion: ++this.state.resizeVersion })
      }),
      100
    )
  }

  render() {
    const CurrentPage = Router.activeView || NotFound
    return (
      <UI.Theme name="light">
        <layout>
          <Header />
          <content>
            <CurrentPage
              key={Router.key + this.state.resizeVersion}
              {...Router.params}
            />
            <CurrentPage
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
