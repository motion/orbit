import React from 'react'
import { view } from '@jot/black'
import { Shortcuts } from '~/helpers'
import { object } from 'prop-types'
import { Theme, SlotFill } from '~/ui'
import { IN_TRAY } from '~/constants'
import NotFound from '~/pages/notfound'
import Router from '~/router'
import Sidebar from './sidebar'
import Header from './header'
import Errors from './errors'
import * as Commander from '~/views/commander'
import KeyStore from '~/stores/keyStore'
import LayoutStore from '~/stores/layoutStore'
import CommanderStore from '~/stores/commanderStore'
import RedBox from 'redbox-react'
import Draft from '~/views/document/draft'

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
      background: '#fff',
      transition: 'right ease-in 250ms',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 10,
    },
  }
}

// stores attached here via provide give us nice ways
// to share logic horizontally between any component
// eg: @view.attach('layoutStore') in any sub-view

@view.provide({
  layoutStore: LayoutStore,
  keyStore: KeyStore,
  commanderStore: CommanderStore,
})
export default class Root {
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
    // does this work?
    // throw error
    this.setState({
      error,
    })
    // until we can clear on next hmr, just show for a second
    this.setTimeout(() => {
      this.setState({ error: null })
    }, 2000)
  }

  renderTray() {
    return <Sidebar />
  }

  renderApp() {
    const { layoutStore } = this.props
    const CurrentPage = Router.activeView || NotFound

    return (
      <app>
        <LayoutWrap layoutStore={layoutStore}>
          <Commander.Results />
          <Header layoutStore={layoutStore} />
          <content
            onScroll={this.onScroll}
            $dragStartedAt={layoutStore.isDragging && this.lastScrolledTo}
          >
            <CurrentPage key={Router.key} {...Router.params} />
          </content>
          <Draft
            isActive={layoutStore.isCreatingDoc}
            onOpenDraft={() => (layoutStore.isCreatingDoc = true)}
            onClose={() => (layoutStore.isCreatingDoc = false)}
          />
        </LayoutWrap>
        <Errors />
        <Sidebar />
      </app>
    )
  }

  render({ layoutStore, keyStore }, { error }) {
    if (error) {
      return <RedBox error={error} />
    }

    return (
      <Theme name="light">
        <SlotFill.Provider>
          <Shortcuts $layout name="all" handler={keyStore.handleShortcuts}>
            {IN_TRAY ? this.renderTray() : this.renderApp()}
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
      zIndex: 100,
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
