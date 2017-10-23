// @flow
import * as React from 'react'
import * as Constants from '~/constants'
import { view } from '@mcro/black'
import NotFound from '~/views/404'
import Router from '~/router'
import Errors from '~/views/layout/errors'
import LayoutWrap from '~/views/layout/wrap'
import Header from './header'
import * as UI from '@mcro/ui'

@view
export default class Layout {
  componentDidMount() {
    window.lastInstance = this
  }

  lastScrolledTo = 0
  onScroll = e => {
    this.lastScrolledTo = e.currentTarget.scrollTop
  }

  render() {
    const CurrentPage = Router.activeView || NotFound
    console.log('@@', Router.key, Router.path)
    if (Constants.IS_BAR) {
      return <CurrentPage />
    }
    return (
      <UI.Theme name="light">
        <layout>
          <LayoutWrap>
            <Header if={!!Constants.APP_KEY} />
            <content onScroll={this.onScroll}>
              <CurrentPage key={Router.key} {...Router.params} />
            </content>
          </LayoutWrap>
          <Errors />
        </layout>
      </UI.Theme>
    )
  }

  static style = {
    layout: {
      position: 'absolute',
      flex: 1,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    hide: {
      opacity: 0,
      pointerEvents: 'none',
    },
    content: {
      flex: 1,
    },
  }
}
