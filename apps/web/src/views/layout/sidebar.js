// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'
import InboxList from '~/views/inbox/list'
import { throttle } from 'lodash'
import Draft from '~/views/inbox/draft'
import { User } from '~/app'
import VirtualizedSelect from 'react-virtualized-select'
import UserMenu from './userMenu'

@view
class AddButton {
  render({ store, ...props }) {
    return (
      <UI.Popover
        openOnClick
        closeOnEsc
        background="#fff"
        width={440}
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
          <UI.Theme if={false && store.show === 'list'} name="light">
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
            css={{
              height: 300,
            }}
            if={true || store.show === 'draft'}
            parentId={User.defaultInbox && User.defaultInbox.id}
            closePopover={() => this.popover && this.popover.close()}
            editorRef={this.ref('draftEditor').set}
          />
        </content>
      </UI.Popover>
    )
  }
}

class SidebarStore {
  show = 'list'
  filters = [{ label: 'Me', value: 1 }, { label: 'Motion', value: 2 }]
  filter = ''
  setFilter = e => {
    this.filter = e.target.value
  }
}

@view.attach('layoutStore')
@view({
  store: SidebarStore,
})
export default class Sidebar {
  scrolling = false

  popover = null

  handleScroll = throttle(() => {
    const { scrollTop } = this.sidebar
    if (scrollTop > 0) {
      if (!this.scrolling) {
        this.scrolling = true
      }
    } else {
      if (this.scrolling) {
        this.scrolling = false
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
          <sidebar
            onScroll={this.handleScroll}
            $$draggable
            ref={this.ref('sidebar').set}
          >
            <bar>
              <barbg $shown={this.scrolling} />
              <VirtualizedSelect
                multi
                options={[
                  { label: 'Me', value: 1 },
                  { label: 'Motion', value: 2 },
                  { label: 'Company', value: 3, disabled: true },
                ]}
                value={store.filters}
                onChange={store.ref('filters').set}
              />

              <end $$marginLeft={50} $$row $$align="center">
                <UI.Button
                  circular
                  chromeless
                  size={1}
                  iconSize={20}
                  background="#000"
                  icon="circle-09"
                  opacity={0.5}
                />
              </end>
            </bar>

            <inbox>
              <InboxList filter={store.filter} />
            </inbox>

            {children}

            <bottom>
              <hi $$flex />
              <UI.Input
                if={false}
                opacity={0}
                color="#fff"
                borderColor={[255, 255, 255, 0.1]}
                size={1.05}
                marginRight={-30}
                onChange={store.setFilter}
                placeholder="Quick add"
              />
              <AddButton $addButton store={store} />
            </bottom>
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
      background: [42, 42, 45, 0.92],
      transform: { y: 0 },
    },
    shown: {
      opacity: 1,
    },
    inbox: {
      margin: [0, -20],
    },
    bottom: {
      position: 'fixed',
      bottom: 20,
      right: 20,
      left: 20,
      zIndex: 1000,
      flexFlow: 'row',
    },
  }
}
