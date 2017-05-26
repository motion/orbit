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
import CreateDocument from '~/views/document/create'

// stores attached here via provide give us nice ways
// to share logic horizontally between any component
// simply @view.attach('layoutStore') for example in any sub-view

@view class Wrap {
  render({ layoutStore, children }) {
    return (
      <wrap $$right={layoutStore.sidebar.trueWidth}>
        {children}
      </wrap>
    )
  }
  static style = {
    wrap: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
    },
  }
}

@view.provide({
  layoutStore: LayoutStore,
  keyStore: KeyStore,
  commanderStore: CommanderStore,
})
export default class Root extends React.Component {
  static childContextTypes = {
    shortcuts: object,
  }

  state = {
    error: null,
  }

  getChildContext() {
    return { shortcuts: this.props.keyStore.manager }
  }

  lastScrolledTo = 0
  onScroll = e => {
    this.lastScrolledTo = e.currentTarget.scrollTop
  }

  unstable_handleError(error) {
    this.setState({
      error,
    })
  }

  render({ layoutStore, keyStore }, { error }) {
    if (error) {
      return <error>{JSON.stringify(error)}</error>
    }

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
          <CircleButton
            if={!layoutStore.creatingDoc}
            onClick={() => layoutStore.createDoc()}
            $circleButton
            icon="add"
          />
        </Wrap>
        <Errors />
        <Sidebar />
        <CreateDocument
          doc={layoutStore.creatingDoc}
          isOpen={layoutStore.creatingDoc !== false}
          onClose={() => layoutStore.creatingDoc = false}
        />
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
