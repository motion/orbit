import React from 'react'
import { view, Shortcuts } from '@jot/helpers'
import { object } from 'prop-types'
import { Theme, SlotFill, Button } from '~/ui'
import { SIDEBAR_WIDTH, HEADER_HEIGHT, IS_ELECTRON } from '~/constants'
import NotFound from '~/pages/notfound'
import Router from '~/router'
import Sidebar from '~/views/layout/sidebar'
import Header from '~/views/layout/header'
import Errors from '~/views/layout/errors'
import Commander from '~/views/commander'
import KeyStore from '~/stores/keyStore'
import LayoutStore from '~/stores/layoutStore'
import RedBox from 'redbox-react'
import Draft from './document/draft'

// stores attached here via provide give us nice ways
// to share logic horizontally between any component
// simply @view.attach('layoutStore') for example in any sub-view

// optimized re-render for sidebar resize
@view
class LayoutWrap {
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
      zIndex: 10,
    },
  }
}

@view.provide({
  layoutStore: LayoutStore,
  keyStore: KeyStore,
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
    throw error
    this.setState({
      error,
    })
    // until we can clear on next hmr, just show for a second
    this.setTimeout(() => {
      this.setState({ error: null })
    }, 2000)
  }

  render({ layoutStore, keyStore }, { error }) {
    if (error) {
      return <RedBox error={error} />
    }

    const CurrentPage = Router.activeView || NotFound

    console.log(
      'root.render',
      Router.key,
      layoutStore.isDragging && this.lastScrolledTo
    )

    return (
      <Theme name="light">
        <SlotFill.Provider>
          <Shortcuts $layout name="all" handler={keyStore.handleShortcuts}>
            <LayoutWrap layoutStore={layoutStore}>
              <Header layoutStore={layoutStore} />
              <content
                onScroll={this.onScroll}
                $dragStartedAt={layoutStore.isDragging && this.lastScrolledTo}
              >
                <CurrentPage key={Router.key} />
              </content>
              <Button
                if={true || !layoutStore.creatingDoc}
                circular
                onClick={() => layoutStore.createDoc()}
                $circleButton
                chromeless
                iconSize={20}
                size={50}
                icon="siadd"
              />
            </LayoutWrap>
            <Errors />
            <Sidebar />
          </Shortcuts>
        </SlotFill.Provider>
      </Theme>
    )
  }

  static style = {
    circleButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      // backdropFilter: `blur(5px)`,
      zIndex: 1000000000,
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
