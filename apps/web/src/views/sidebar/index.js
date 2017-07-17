// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'
import Inbox from '~/views/inbox'
import { User } from '@mcro/models'
import { throttle } from 'lodash'

@view.attach('layoutStore')
@view
export default class Sidebar {
  state = {
    scrolling: false,
  }

  handleScroll = throttle(() => {
    const { scrollTop } = this.sidebar
    if (scrollTop > 0) {
      if (!this.state.scrolling) {
        this.setState({ scrolling: true })
      }
    } else {
      if (this.state.scrolling) {
        this.setState({ scrolling: false })
      }
    }
  }, 32)

  render({ hidden, layoutStore, store, ...props }) {
    const width = Constants.IN_TRAY
      ? Constants.TRAY_WIDTH
      : layoutStore.sidebar.width

    return (
      <UI.Theme name="clear-dark">
        <UI.Drawer
          zIndex={1}
          transition={Constants.SIDEBAR_TRANSITION}
          background="transparent"
          key={2}
          open={!hidden}
          from="right"
          size={width}
        >
          <sidebar
            $$draggable
            onScroll={this.handleScroll}
            ref={this.ref('sidebar').set}
          >
            <bar>
              <barbg $shown={this.state.scrolling} />
              <UI.Title>All</UI.Title>
              <UI.Dropdown
                theme="clear-dark"
                popoverProps={{ background: [50, 50, 50, 0.9] }}
                items={['All', 'Other']}
              >
                Filter
              </UI.Dropdown>
            </bar>
            <Inbox hideTitle />
          </sidebar>
        </UI.Drawer>
      </UI.Theme>
    )
  }

  static style = {
    sidebar: {
      userSelect: 'none',
      position: 'absolute',
      overflowY: 'scroll',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      padding: [0, 20],
    },
    bar: {
      flexFlow: 'row',
      justifyContent: 'space-between',
      padding: [10, 20],
      margin: [-10, -20, 10],
      position: 'sticky',
      top: 0,
      background: [0, 0, 0, 0.1],
      zIndex: 10000,
    },
    barbg: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: [60, 68, 75],
      opacity: 0,
      zIndex: -1,
      transition: 'all ease-in 200ms',
    },
    shown: {
      opacity: 1,
    },
  }
}
