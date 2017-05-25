import React from 'react'
import { view, Shortcuts } from '~/helpers'
import { object } from 'prop-types'
import { CircleButton } from '~/ui'
import { SIDEBAR_WIDTH, HEADER_HEIGHT, IS_ELECTRON } from '~/constants'
import NotFound from '~/pages/notfound'
import Router from '~/router'
import Sidebar from '~/views/layout/sidebar'
import Header from '~/views/layout/header'
import Errors from '~/views/layout/errors'
import KeyStore from '~/stores/keys'
import CommanderStore from '~/stores/commander'
import LayoutStore from '~/stores/layout'

// stores attached here via provide give us nice ways
// to share logic horizontally between any component
// simply @view.attach('layoutStore') for example in any sub-view

@view class Wrap {
  render({ layoutStore, children }) {
    return (
      <wrap $$width={window.innerWidth - layoutStore.sidebar.trueWidth}>
        {children}
      </wrap>
    )
  }
  static style = {
    wrap: {
      position: 'relative',
      flex: 1,
    },
  }
}

@view.provide({
  layoutStore: LayoutStore,
  keyStore: KeyStore,
  commanderStore: CommanderStore,
})
export default class Root {
  static childContextTypes = {
    shortcuts: object,
  }

  getChildContext() {
    return { shortcuts: this.props.keyStore.manager }
  }

  lastScrolledTo = 0
  onScroll = e => {
    this.lastScrolledTo = e.currentTarget.scrollTop
  }

  render({ layoutStore, keyStore }) {
    const CurrentPage = Router.activeView || NotFound

    console.log(
      'root.render',
      Router.key,
      layoutStore.isDragging && this.lastScrolledTo
    )

    return (
      <Shortcuts $layout name="all" handler={keyStore.handleShortcuts}>
        <Wrap layoutStore={layoutStore}>
          <Header layoutStore={layoutStore} />
          <content
            onScroll={this.onScroll}
            $dragStartedAt={layoutStore.isDragging && this.lastScrolledTo}
          >
            <CurrentPage key={Router.key} />
          </content>
          <CircleButton $circleButton icon="add" />
        </Wrap>
        <Errors />
        <Sidebar />
      </Shortcuts>
    )
  }

  static style = {
    circleButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
    },
    layout: {
      flex: 1,
      flexFlow: 'row',
    },
    content: {
      flex: 1,
      position: 'relative',
      overflowX: 'visible',
      overflowY: 'scroll',
      zIndex: 10,
    },
    dragStartedAt: pos => ({
      overflowX: 'visible',
      overflowY: 'visible',
      transform: {
        y: -pos,
      },
    }),
  }
}
