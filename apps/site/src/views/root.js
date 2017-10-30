// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import Router from '~/router'
import NotFound from '~/views/pages/404'
import Header from '~/views/header'
import * as UI from '@mcro/ui'

@view
export default class Root {
  render() {
    const CurrentPage = Router.activeView || NotFound
    return (
      <UI.Theme name="light">
        <layout>
          <Header />
          <content>
            <CurrentPage key={Router.key} {...Router.params} />
            <CurrentPage blurred key={Router.key + '2'} {...Router.params} />
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
