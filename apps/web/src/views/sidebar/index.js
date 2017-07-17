// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'
import Inbox from '~/views/inbox'
import { User } from '@mcro/models'
import { throttle } from 'lodash'
import Draft from '~/views/inbox/draft'

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
              <UI.Dropdown
                width={140}
                popoverProps={{
                  background: [50, 50, 50, 0.9],
                  openOnHover: false,
                }}
                items={[
                  '🎩 Crypto Lords',
                  'BaySide Mafia',
                  'Fatwana Secret Society',
                ]}
                buttonProps={{ chromeless: true }}
              >
                <UI.Title>Motion</UI.Title>
              </UI.Dropdown>

              <end $$row>
                <UI.Dropdown
                  popoverProps={{
                    background: [50, 50, 50, 0.9],
                    openOnHover: false,
                  }}
                  items={['All', 'Other']}
                >
                  Filter
                </UI.Dropdown>

                <UI.Popover
                  openOnClick
                  closeOnEscape
                  background="#fff"
                  width={480}
                  borderRadius={8}
                  elevation={2}
                  ref={this.ref('popover').set}
                  target={
                    <UI.Button
                      inline
                      chromeless
                      icon="circleadd"
                      size={1.2}
                      marginLeft={8}
                      marginRight={-10}
                      marginTop={-5}
                      marginBottom={-5}
                    />
                  }
                >
                  <Draft
                    document={{}}
                    closePopover={() => this.popover.close()}
                  />
                </UI.Popover>
              </end>
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
      margin: [-10, -20, 10, -30],
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
