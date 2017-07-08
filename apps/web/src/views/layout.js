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
import Explorer from '~/explorer'
import ExplorerStore from '~/stores/explorerStore'
import LayoutStore from '~/stores/layoutStore'
import SoundStore from '~/stores/soundStore'
import Draft from '~/views/draft'
import LayoutWrap from '~/views/layout/wrap'
import { start } from '../start'
import Signup from './signup'
import { User } from '@mcro/models'
import { Bar } from '~/explorer'

type Props = {
  layoutStore: LayoutStore,
  explorerStore: ExplorerStore,
  soundStore: SoundStore,
}

if (module && module.hot) {
  module.hot.accept(() => {
    log('accept: ./layout.js')
    start(false, true)
  })
}

// @view.attach('layoutStore') in any sub-view
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

  lastScrolledTo = 0
  onScroll = e => {
    this.lastScrolledTo = e.currentTarget.scrollTop
  }

  renderTray() {
    return <Sidebar />
  }

  renderApp() {
    const { layoutStore } = this.props
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
            <CurrentPage key={Router.key} {...Router.params} />
            <Explorer />
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

  render({ explorerStore }: Props) {
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
                {IN_TRAY ? this.renderTray() : this.renderApp()}
              </Shortcuts>
            </UI.SlotFill.Provider>
          </UI.Theme>
        </UI.ContextMenu>
      </root>
    )
  }

  static style = {
    root: {
      boxShadow: [['inset', 0, 10, 20, [0, 0, 0, 0.04]]],
      background: Constants.IS_ELECTRON ? [40, 40, 40, 0.2] : '#252525',
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
      background: 'white',
      position: 'relative',
      overflowX: 'visible',
      overflowY: 'scroll',
      zIndex: 100,
      borderRightRadius: 8,
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
