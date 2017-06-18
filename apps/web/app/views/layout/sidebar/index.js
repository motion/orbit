// @flow
import React from 'react'
import { view } from '@jot/black'
import { Shortcuts } from '~/helpers'
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
import Team from './team'
import Router from '~/router'
import fuzzy from 'fuzzy'
import randomcolor from 'randomcolor'
import SidebarStore from './store'
import type LayoutStore from '~/stores/layoutStore'
import { IN_TRAY, TRAY_WIDTH } from '~/constants'
import Tasks from './tasks'
import TaskItem from './taskItem'

type Props = {
  layoutStore: LayoutStore,
  store: SidebarStore,
}

@view
class PlayUI {
  render() {
    return (
      <ui>
        <top>
          <filter>
            <Icon name="min-add" />
          </filter>
          <avatar />
        </top>

        <section>
          <title>Me</title>
          <list>
            {['XYZ', 'abc', 'mno'].map((item, index) =>
              <item key={index}>
                <Icon name="hambuger" />
                <name>XYZ</name>
                <flex />
                <input type="checkbox" />
              </item>
            )}
          </list>
        </section>

        test me out
      </ui>
    )
  }
  static style = {
    ui: {
      background: 'red',
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
    if (!IN_TRAY) {
      this.props.layoutStore.sidebar.attachDragger(this.dragger)
    }
  }

  render({ layoutStore, store }: Props) {
    const active = IN_TRAY ? true : layoutStore.sidebar.active
    const width = IN_TRAY ? TRAY_WIDTH : layoutStore.sidebar.width

    return (
      <Shortcuts name="all" handler={store.handleShortcut}>
        <Drawer noOverlay open={active} from="right" size={width} zIndex={9}>
          <dragger
            if={!IN_TRAY}
            style={{ WebkitAppRegion: 'no-drag' }}
            ref={this.ref('dragger').set}
          />
          <sidebar>
            <Login if={!IN_TRAY} />

            <orgs if={false} $$row>
              {['motion', 'cr', 'baes', 'awe'].map((name, i) =>
                <Button
                  key={i}
                  style={{ marginLeft: 5, marginRight: 5 }}
                  circular
                  size={32}
                  iconSize={12}
                  color={randomcolor()}
                  icon={name}
                />
              )}
            </orgs>

            <playui>
              <PlayUI />
            </playui>

            <tasks if={false}>
              <Pane if={store.inProgress} title="Current Task">
                <activeItem>
                  <TaskItem
                    task={store.inProgress}
                    active={false}
                    onClick={() => {}}
                    inProgress
                    noDrag
                  />
                </activeItem>
              </Pane>
              <Pane
                collapsable
                scrollable
                title={`Your Tasks`}
                titleProps={{
                  after: (
                    <Segment itemProps={{ chromeless: true }} $$flex={1}>
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
                  ),
                }}
              >
                <content $$draggable>
                  <ContextMenu
                    $context
                    options={[
                      {
                        title: 'Delete',
                        onSelect: place => place.delete(),
                      },
                    ]}
                  >
                    <Tasks store={store} />
                  </ContextMenu>
                </content>
              </Pane>

              <Pane collapsable title="Team">
                <Team store={store} />
              </Pane>
            </tasks>

            <SlotFill.Slot name="sidebar">
              {items =>
                <activeSidebar>
                  {items}
                </activeSidebar>}
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
      maxHeight: 35,
      flex: 1,
    },
    top: {
      flex: 1,
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
