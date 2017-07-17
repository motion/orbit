// @flow
import React from 'react'
import * as Constants from '~/constants'
import { view, Shortcuts } from '@mcro/black'
import { object } from 'prop-types'
import * as UI from '@mcro/ui'
import { IN_TRAY } from '~/constants'
import NotFound from '~/pages/404Page'
import Router from '~/router'
import Sidebar from '~/views/sidebar'
import Errors from '~/views/layout/errors'
import ExplorerStore from '~/stores/explorerStore'
import LayoutStore from '~/stores/layoutStore'
import SoundStore from '~/stores/soundStore'
import LayoutWrap from '~/views/layout/wrap'
import Signup from './signup'
import { User } from '@mcro/models'
import { Bar, Results } from '~/explorer'
import BottomBar from '~/views/bottomBar'

type Props = {
  layoutStore: LayoutStore,
  explorerStore: ExplorerStore,
  soundStore: SoundStore,
}

@view.provide({
  layoutStore: LayoutStore,
  soundStore: SoundStore,
  explorerStore: ExplorerStore,
})
export default class Layout {
  props: Props

  static childContextTypes = {
    shortcuts: object,
  }

  state = {
    error: null,
  }

  getChildContext() {
    return { shortcuts: this.props.explorerStore.keyManager }
  }

  componentDidMount() {
    window.lastInstance = this
  }

  lastScrolledTo = 0
  onScroll = e => {
    this.lastScrolledTo = e.currentTarget.scrollTop
  }

  render({ explorerStore, layoutStore }: Props) {
    const renderTray = () => <Sidebar />
    const renderApp = () => {
      const CurrentPage = Router.activeView || NotFound
      return (
        <app>
          <Signup />
          <LayoutWrap layoutStore={layoutStore}>
            <Bar />
            <content
              if={User.loggedIn}
              onScroll={this.onScroll}
              $dragStartedAt={layoutStore.isDragging && this.lastScrolledTo}
            >
              <Results />
              <CurrentPage key={Router.key} {...Router.params} />
            </content>
          </LayoutWrap>
          <Errors />
          <Sidebar hidden={!layoutStore.sidebar.active}>
            <BottomBar />
          </Sidebar>
        </app>
      )
    }

    return (
      <root>
        <UI.ContextMenu
          inactive
          options={[
            {
              title: 'Delete',
              onSelect: place => place.delete(),
            },
          ]}
        >
          <UI.Theme name="light">
            <UI.SlotFill.Provider>
              <Shortcuts
                $layout
                name="all"
                handler={explorerStore.handleShortcuts}
              >
                {IN_TRAY ? renderTray() : renderApp()}
              </Shortcuts>
            </UI.SlotFill.Provider>
          </UI.Theme>
        </UI.ContextMenu>
      </root>
    )
  }

  static style = {
    root: {
      background: Constants.IS_ELECTRON ? [60, 68, 75, 0.75] : [110, 110, 110],
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    hide: {
      opacity: 0,
      pointerEvents: 'none',
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
