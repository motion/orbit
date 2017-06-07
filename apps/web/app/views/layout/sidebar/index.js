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
  Icon,
  Link,
  Input,
  Segment,
  Button,
  SlotFill,
} from '~/ui'
import { User, Place } from '@jot/models'
import Login from '../login'
import Router from '~/router'
import fuzzy from 'fuzzy'
import randomcolor from 'randomcolor'
import SidebarStore from './store'
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc'

const DragHandle = SortableHandle(() => (
  <div style={{ padding: 10 }}> <Icon name="ui-2_menu-34" size={12} /></div>
)) //<span style={{ padding: 10 }}>::</span>) // This can be any component you want

@view class Item {
  render({ active, index, task, ...props }) {
    const className = 'strikethrough ' + (task.archive ? 'active' : '')

    // css structure is for archive animation
    return (
      <item $first={index === 0} $active={active === true}>
        <DragHandle />
        <content>
          <Text $text {...props}>
            <div className={className}><p><span>{task.text}</span></p></div>
          </Text>
          <bottom $$row>
            <tags>
              June 2 by Steel
            </tags>
            <tag onMouseDown={() => Router.go(task.doc.url())}>
              {task.doc.title}
            </tag>
          </bottom>
        </content>
      </item>
    )
  }

  static style = {
    content: {
      flex: 3,
    },
    first: {
      borderTop: '1px solid #ddd',
    },
    tags: {
      color: `rgba(0, 0, 0, 0.6)`,
      fontSize: 12,
    },
    bottom: {
      flex: 1,
      justifyContent: 'space-between',
    },
    item: {
      flexFlow: 'row',
      padding: [7, 5],
      background: '#fefefe',
      borderBottom: '1px solid #ddd',
      fontSize: 14,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    active: {
      background: '#eee',
    },
    tag: {
      padding: [0, 6],
      cursor: 'pointer',
      textSelect: 'none',
      textOverflow: 'ellipsis',
      border: '1px solid #ddd',
      fontSize: 12,
      maxWidth: 100,
      textAlign: 'center',
      flex: 1,
      color: 'rgba(0,0,0,.4)',
      transition: 'background 50ms ease-in',
      borderRadius: 5,
      '&:hover': {
        background: '#eee',
      },
      '&:active': {
        background: '#ddd',
      },
    },
    span: {
      paddingTop: 2,
    },
  }
}

/* sortable eats index, so add _index for item styling */
const SortableItem = SortableElement(({ _index, value }) => (
  <div style={{ zIndex: 1000000 }}><Item index={_index} task={value} /></div>
))

const SortableList = SortableContainer(({ items }) => {
  return (
    <ul>
      {items.map((task, index) => (
        <SortableItem
          key={task.key}
          _index={index}
          index={index}
          value={task}
        />
      ))}
    </ul>
  )
})

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

  onSortEnd = () => {
    console.log('on sort end')
  }

  render({ layoutStore, store }) {
    return (
      <Shortcuts name="all" handler={layoutStore.sidebar.handleShortcut}>
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
                <top $$row>
                  <input
                    $search
                    placeholder="tasks"
                    onChange={e => (store.filter = e.target.value)}
                  />
                  <Segment>
                    <Button
                      active={store.hideArchived == false}
                      onClick={() => (store.hideArchived = false)}
                    >
                      All
                    </Button>
                    <Button
                      active={store.hideArchived}
                      onClick={() => (store.hideArchived = true)}
                    >
                      Active
                    </Button>
                  </Segment>
                </top>
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
                  <SortableList
                    items={store.tasks}
                    useDragHandle={true}
                    onSortEnd={this.onSortEnd}
                  />
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
      </Shortcuts>
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
