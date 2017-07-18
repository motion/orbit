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

  popover = null

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

  render({ hidden, layoutStore, store, children, ...props }) {
    const width = Constants.IN_TRAY
      ? Constants.TRAY_WIDTH
      : layoutStore.sidebar.width

    return (
      <UI.Theme name="clear-dark">
        <UI.Drawer
          zIndex={1}
          background="transparent"
          transition={Constants.SIDEBAR_TRANSITION}
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
                noWrap
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
                <UI.Input color="#fff" borderRadius={100} size={1} />
              </UI.Dropdown>

              <end $$row $$align="center">
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
                  closeOnEsc
                  background="#fff"
                  width={540}
                  borderRadius={8}
                  elevation={2}
                  ref={this.ref('popover').set}
                  target={
                    <UI.Button
                      inline
                      circular
                      chromeless
                      paddingTop={2}
                      icon="circleadd"
                      size={1.4}
                      marginLeft={10}
                      marginRight={-10}
                      marginTop={-5}
                      marginBottom={-5}
                    />
                  }
                >
                  <Draft
                    document={{}}
                    closePopover={() => this.popover && this.popover.close()}
                  />
                </UI.Popover>
              </end>
            </bar>

            <Inbox hideTitle />

            {children}
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
      alignItems: 'center',
      padding: [10, 20],
      margin: [-10, -20, 10, -30],
      position: 'sticky',
      top: 0,
      background: [0, 0, 0, 0.1],
      zIndex: 10000,
      transform: { y: 0 },
    },
    barbg: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#111',
      opacity: 0,
      zIndex: -1,
      transition: 'all ease-in 200ms',
      transform: { y: 0 },
    },
    shown: {
      opacity: 1,
    },
  }
}
