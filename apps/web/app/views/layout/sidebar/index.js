// @flow
import React from 'react'
import { view, Shortcuts } from '~/helpers'
import { uniqBy } from 'lodash'
import {
  Drawer,
  Text,
  Pane,
  ContextMenu,
  List,
  Link,
  Input,
  Button,
  SlotFill,
} from '~/ui'
import { User, Place } from '@jot/models'
import Login from './login'
import Router from '~/router'
import fuzzy from 'fuzzy'
import randomcolor from 'randomcolor'
import SidebarStore from './store'

@view class Item {
  render({ active, task, ...props }) {
    const className = 'strikethrough ' + (task.archive ? 'active' : '')

    return (
      <item $active={active === true}>
        <Text {...props}>
          <div className={className}><p><span>{task.text}</span></p></div>
        </Text>
        <tag>{task.doc.getTitle()}</tag>
      </item>
    )
  }

  static style = {
    item: {
      flexFlow: 'row',
      padding: [5, 10],
      fontSize: 16,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    active: {
      background: '#eee',
    },
    tag: {
      padding: [3, 10],
      border: '1px solid #ddd',
      fontSize: 12,
      color: 'rgba(0,0,0,.4)',
      borderRadius: 5,
    },
    span: {
      paddingTop: 2,
    },
  }
}

@view.attach('layoutStore')
@view({
  store: SidebarStore,
})
export default class Sidebar {
  dragger = null

  componentDidMount() {
    this.props.layoutStore.sidebar.attachDragger(this.dragger)
  }

  getListItem = (task, index) => {
    const { store } = this.props

    return (
      <ContextMenu.Target data={{}}>
        <Item
          active={store.active && store.active.key === task.key}
          task={task}
          editable={false}
          autoselect
        />
      </ContextMenu.Target>
    )
  }

  render({ layoutStore, store }) {
    console.log('active is', store.active)

    return (
      <Drawer
        noOverlay
        open={layoutStore.sidebar.active}
        from="right"
        size={layoutStore.sidebar.width}
        zIndex={9}
      >
        <dragger
          style={{ WebkitAppRegion: 'no-drag' }}
          ref={this.ref('dragger').set}
        />
        <sidebar>
          <top>
            <Login />

            <orgs $$row>
              {['motion', 'cr', 'baes', 'awe'].map((name, i) => (
                <Button
                  key={i}
                  style={{ marginLeft: 5, marginRight: 5 }}
                  circular
                  size={32}
                  iconSize={12}
                  color={randomcolor()}
                  icon={name}
                />
              ))}
            </orgs>

            <title $$row $$justify="space-between" $$padding={[4, 6]}>
              <input
                $search
                placeholder="tasks"
                onChange={e => (store.filter = e.target.value)}
              />
              <Button
                chromeless
                icon="simple-add"
                onClick={() =>
                  store.setEditing({
                    _id: Math.random(),
                    title: '',
                    temporary: true,
                    save() {
                      return Place.create({ title: this.title })
                    },
                  })}
              />
            </title>
          </top>

          <content>
            <Pane
              scrollable
              collapsed={store.allPlacesClosed}
              onSetCollapse={store.ref('allPlacesClosed').set}
            >
              <ContextMenu
                options={[
                  {
                    title: 'Delete',
                    onSelect: place => place.delete(),
                  },
                ]}
              >
                <Shortcuts name="all" handler={store.handleShortcuts}>
                  <List
                    controlled
                    items={store.tasks}
                    onSelect={task => {
                      store.active = task
                    }}
                    onCmdEnter={task => {
                      store.onArchive(task)
                    }}
                    getItem={this.getListItem}
                  />
                </Shortcuts>
              </ContextMenu>
            </Pane>

            <draggable $$draggable />
          </content>

          <SlotFill.Slot name="sidebar">
            {items => (
              <activeSidebar>
                {items}
              </activeSidebar>
            )}
          </SlotFill.Slot>
        </sidebar>
      </Drawer>
    )
  }

  static style = {
    sidebar: {
      width: '100%',
      borderLeft: [1, 'dotted', '#eee'],
      userSelect: 'none',
      background: '#fafafa',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
    },
    content: {
      flex: 1,
    },
    dragger: {
      width: 8,
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 10000,
      cursor: 'ew-resize',
    },
    draggable: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 8,
      zIndex: -1,
    },
    search: {
      border: 'none',
      background: 'transparent',
      margin: ['auto', 0],
      fontSize: 14,
      width: '70%',
      opacity: 0.6,
      '&:hover': {
        opacity: 1,
      },
      '&:focus': {
        opacity: 1,
      },
    },
  }
}
