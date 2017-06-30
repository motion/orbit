// @flow
import React from 'react'
import * as Constants from '~/constants'
import { view, Shortcuts } from '@mcro/black'
import { object } from 'prop-types'
import { Glint, Theme, SlotFill } from '@mcro/ui'
import { IN_TRAY } from '~/constants'
import { User } from '@mcro/models'
import NotFound from '~/pages/404Page'
import Router from '~/router'
import Sidebar from '~/views/sidebar'
import Header from '~/views/layout/header'
import Errors from '~/views/layout/errors'
import * as Commander from '~/views/commander'
import LayoutStore from '~/stores/layoutStore'
import SoundStore from '~/stores/soundStore'
import CommanderStore from '~/stores/commanderStore'
import Draft from '~/views/draft'
import Onboard from './onboard'
import LayoutWrap from '~/views/layout/wrap'

type Props = {
  layoutStore: LayoutStore,
  commanderStore: CommanderStore,
  soundStore: SoundStore,
}

// @view.attach('layoutStore') in any sub-view
@view.provide({
  layoutStore: LayoutStore,
  soundStore: SoundStore,
  commanderStore: CommanderStore,
})
export default class Root {
  props: Props

  static childContextTypes = {
    shortcuts: object,
  }

  state = {
    error: null,
  }

  getChildContext() {
    return { shortcuts: this.props.commanderStore.keyManager }
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
    const { showOnboard } = layoutStore

    return (
      <app>
        <Glint color={[255, 255, 255, 0.2]} borderRadius={6} />
        <Onboard if={showOnboard} />
        <LayoutWrap layoutStore={layoutStore}>
          <Commander.Results />
          <Header layoutStore={layoutStore} />
          <SlotFill.Slot name="crumbs">
            {breadcrumbs => {
              return (
                <crumbs>
                  {breadcrumbs}
                </crumbs>
              )
            }}
          </SlotFill.Slot>
          <content
            onScroll={this.onScroll}
            $dragStartedAt={layoutStore.isDragging && this.lastScrolledTo}
            $hide={layoutStore.isCommanderOpen}
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

  render({ layoutStore, commanderStore }: Props, { error }) {
    return (
      <root>
        <Theme name="light">
          <SlotFill.Provider>
            <Shortcuts
              $layout
              name="all"
              handler={commanderStore.handleShortcuts}
            >
              {IN_TRAY ? this.renderTray() : this.renderApp()}
            </Shortcuts>
          </SlotFill.Provider>
        </Theme>
      </root>
    )
  }

  static style = {
    root: {
      background: Constants.IS_ELECTRON ? [40, 40, 40, 0.2] : '#252525',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    circleButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      zIndex: 1000000000,
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
