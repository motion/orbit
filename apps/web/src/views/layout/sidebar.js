// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'
import InboxList from '~/views/inbox/list'
import { throttle } from 'lodash'
import Draft from '~/views/inbox/draft'
import { User } from '~/app'

class SidebarStore {
  show = 'list'
  filter = ''
  setFilter = e => {
    this.filter = e.target.value
  }
}

@view
class AddButton {
  render({ store, ...props }) {
    return (
      <UI.Popover
        openOnClick
        closeOnEsc
        overlay
        background="#fff"
        width={store.show === 'list' ? 300 : 540}
        borderRadius={8}
        elevation={2}
        ref={this.ref('popover').set}
        onDidOpen={() => this.draftEditor && this.draftEditor.focus()}
        onClose={store.ref('show').setter('list')}
        target={
          <UI.Button
            circular
            theme="light"
            elevation={3}
            icon="simadd"
            size={1.4}
            marginLeft={10}
            marginTop={-5}
            marginBottom={-5}
            {...props}
          />
        }
      >
        <content>
          <UI.Theme if={store.show === 'list'} name="light">
            <UI.List itemProps={{ size: 2 }}>
              <UI.ListItem
                icon="paper"
                primary="Discussion"
                onClick={store.ref('show').setter('draft')}
              />
              <UI.ListItem icon="filesg" primary="Page" />
            </UI.List>
          </UI.Theme>

          <Draft
            if={store.show === 'draft'}
            parentId={User.defaultInbox && User.defaultInbox.id}
            closePopover={() => this.popover && this.popover.close()}
            editorRef={this.ref('draftEditor').set}
          />
        </content>
      </UI.Popover>
    )
  }
}

@view.attach('layoutStore')
@view({
  store: SidebarStore,
})
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

  render({ store, hidden, layoutStore, children, ...props }) {
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
          <sidebar $$draggable ref={this.ref('sidebar').set}>
            <bar>
              <barbg $shown={this.state.scrolling} />
              <UI.Input
                color="#fff"
                borderColor={[255, 255, 255, 0.1]}
                size={1}
                marginRight={30}
                onChange={store.setFilter}
              />

              <end $$marginLeft={20} $$row $$align="center" />
            </bar>

            <inbox>
              <InboxList filter={store.filter} />
            </inbox>

            {children}

            <AddButton $addButton store={store} />
          </sidebar>
        </UI.Drawer>
      </UI.Theme>
    )
  }

  static style = {
    sidebar: {
      userSelect: 'none',
      position: 'absolute',
      overflowY: 'auto',
      overflowX: 'hidden',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    bar: {
      flexFlow: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      margin: [-10, 0, 10, 0],
      position: 'sticky',
      top: 0,
      background: [42, 42, 45, 0.92],
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
    inbox: {
      margin: [0, -20],
    },
    addButton: {
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 1000,
    },
  }
}
