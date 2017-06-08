// @flow
import React from 'react'
import { view, Shortcuts } from '~/helpers'
import { uniqBy, sortBy } from 'lodash'
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
  render({
    active,
    inProgress,
    onDoubleClick,
    noDrag,
    onClick,
    index,
    task,
    ...props
  }) {
    const className = 'strikethrough ' + (task.archive ? 'active' : '')

    // css structure is for archive animation
    return (
      <item
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        $$undraggable
        $first={index === 0}
        $active={active === true}
        $inProgress={inProgress}
      >
        <greenDot if={inProgress} />
        <DragHandle if={!noDrag} />
        <content>
          <Text $text {...props}>
            <div className={className}>
              <p><span>{task.text} {task.sort}</span></p>
            </div>
          </Text>
          <bottom $$row>
            <tags>
              June 2 by Steel
            </tags>
            <Button onMouseDown={() => Router.go(task.doc.url())}>
              {task.doc.title}
            </Button>
          </bottom>
        </content>
      </item>
    )
  }

  static style = {
    content: {
      flex: 3,
      marginLeft: 5,
    },
    greenDot: {
      background: '#54ff54',
      width: 10,
      opacity: 0.5,
      height: 10,
      borderRadius: 10,
      margin: 10,
      border: `1px solid #24cc24`,
    },
    inProgress: {
      borderTop: '1px solid #ddd',
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
      transition: 'background 60ms ease-in',
    },
    active: {
      background: 'rgba(254, 255, 237, 1)',
    },
    span: {
      paddingTop: 2,
    },
  }
}

/* sortable eats index, so add _index for item styling */
const SortableItem = SortableElement(
  ({ active, onDoubleClick, onClick, _index, value }) => (
    <div style={{ zIndex: 1000000 }}>
      <Item
        active={active}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        index={_index}
        task={value}
      />
    </div>
  )
)

const SortableList = SortableContainer(
  ({ active, onDoubleClick, onClick, items }) => {
    return (
      <ul>
        {items.map((task, index) => (
          <SortableItem
            onClick={() => onClick(task)}
            onDoubleClick={() => onDoubleClick(task)}
            active={active && active.key === task.key}
            key={task.key}
            _index={index}
            index={index}
            value={task}
          />
        ))}
      </ul>
    )
  }
)

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
      <Shortcuts name="all" handler={store.handleShortcut}>
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

              <orgs if={false} $$row>
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
                  placeholder="current task"
                  onChange={e => (store.filter = e.target.value)}
                />
              </title>

              <activeItem>
                <Item
                  if={store.inProgress}
                  task={store.inProgress}
                  active={false}
                  onClick={() => {}}
                  inProgress
                  noDrag
                />
              </activeItem>

              <title $$row $$justify="space-between" $$padding={[4, 6]}>
                <top $$row>
                  <input
                    $search
                    placeholder={User.user.name + "'s tasks"}
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

            <content $$draggable>
              <Pane
                scrollable
                collapsed={store.allPlacesClosed}
                onSetCollapse={store.ref('allPlacesClosed').set}
              >
                <ContextMenu
                  $context
                  options={[
                    {
                      title: 'Delete',
                      onSelect: place => place.delete(),
                    },
                  ]}
                >
                  <SortableList
                    onSortEnd={store.onSortEnd}
                    onClick={store.onSelect}
                    onDoubleClick={store.onSetProgress}
                    active={store.activeTask}
                    items={store.tasks}
                    useDragHandle={true}
                    onSortEnd={store.onSortEnd}
                  />
                </ContextMenu>
              </Pane>
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
    title: {
      marginTop: 0,
    },
    context: {
      flex: 1,
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
