// @flow
import React from 'react'
import { view, ViewType } from '@jot/black'
import { Shortcuts } from '~/helpers'
import { uniqBy, sortBy } from 'lodash'
import {
  Theme,
  Drawer,
  Text,
  Pane,
  ContextMenu,
  List,
  Icon,
  Link,
  Input,
  Segment,
  Title,
  Button,
  Dropdown,
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
class TasksUI {
  render() {
    return (
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
    )
  }
}

@view
class TeamStatus {
  render() {
    return (
      <team>
        {[
          { name: 'Steel', status: 'Doing stuff', time: '10m' },
          { name: 'Nate', status: 'Doing stuff', time: '10m' },
          { name: 'Nick', status: 'Doing stuff', time: '10m' },
          { name: 'Jacob', status: 'Doing stuff', time: '10m' },
        ].map(player =>
          <player key={player.name}>
            <card>
              <name>{player.name}</name>
              <info>
                <status>{player.status}</status>
                <time>{player.time}</time>
              </info>
            </card>
          </player>
        )}
      </team>
    )
  }
  static style = {
    team: {
      flexFlow: 'row',
      flexWrap: 'wrap',
    },
    player: {
      width: '50%',
      padding: 3,
    },
    card: {
      borderRadius: 5,
      padding: 15,
      '&:hover': {
        background: [0, 0, 0, 0.1],
      },
    },
    info: {
      flexFlow: 'row',
      justifyContent: 'space-between',
    },
    status: {
      fontSize: 12,
      opacity: 0.4,
    },
    time: {
      fontSize: 10,
      opacity: 0.2,
    },
  }
}

@view({
  store: class {
    team = 'Motion'
  },
})
class PlayUI implements ViewType {
  render({ store }: { store: SidebarStore }) {
    console.log('render playui')
    const color = '#66a734'
    const borderColor = [255, 255, 255, 0.3]
    const paneProps = {
      $mainPane: true,
      collapsable: true,
      titleProps: { color, borderColor },
    }
    return (
      <ui>
        <TeamStatus />

        <Segment controlled itemProps={{ $$flex: 1 }}>
          <Button>tasks</Button>
          <Button>docs</Button>
        </Segment>

        <content $$scrollable $$flex={6}>
          <Pane {...paneProps} title="Me">
            <List
              items={['lorem ipsum', 'dolor sit amet', 'pig latin']}
              getItem={item => ({
                primary: item,
                date: '10m',
                before: (
                  <Icon $icon size={6} name="menu" color={[255, 255, 255]} />
                ),
                after: <Input type="checkbox" />,
              })}
            />
          </Pane>

          <Pane
            $teamPane
            {...paneProps}
            title={
              <tat $$row>
                Team: &nbsp;
                <Dropdown
                  items={['Motion', 'Something', 'Else']}
                  color={[255, 255, 255, 0.8]}
                  onChange={store.ref('team').set}
                >
                  <span>{store.team}</span>
                </Dropdown>
              </tat>
            }
          >
            <Pane $subPane sub collapsable title="Steel">
              <List
                items={['lorem ipsum', 'dolor sit amet', 'pig latin']}
                getItem={item => ({
                  primary: item,
                  date: '10m',
                  before: (
                    <Icon $icon size={6} name="menu" color={[255, 255, 255]} />
                  ),
                  after: <input type="checkbox" />,
                })}
              />
            </Pane>
            <Pane $subPane sub collapsable title="Nick">
              <List
                items={['lorem ipsum', 'dolor sit amet', 'pig latin']}
                getItem={item => ({
                  primary: item,
                  date: '10m',
                  before: (
                    <Icon $icon size={6} name="menu" color={[255, 255, 255]} />
                  ),
                  after: <input type="checkbox" />,
                })}
              />
            </Pane>
            <Pane $subPane sub collapsable title="Jacob">
              <List
                items={['lorem ipsum', 'dolor sit amet', 'pig latin']}
                getItem={item => ({
                  primary: item,
                  date: '10m',
                  before: (
                    <Icon $icon size={6} name="menu" color={[255, 255, 255]} />
                  ),
                  after: <input type="checkbox" />,
                })}
              />
            </Pane>
          </Pane>
        </content>

        <Pane {...paneProps} title="Queue">
          <List
            items={['lorem ipsum', 'dolor sit amet', 'pig latin']}
            getItem={item => ({
              primary: item,
              date: '10m',
              before: (
                <Icon $icon size={6} name="menu" color={[255, 255, 255]} />
              ),
              after: <input type="checkbox" />,
            })}
          />
        </Pane>
      </ui>
    )
  }
  static style = {
    ui: {
      padding: [0, 10],
      flex: 1,
    },
    icon: {
      marginLeft: -5,
      marginRight: 7,
      opacity: 0.25,
    },
    mainPane: {
      paddingBottom: 10,
    },
    teamPane: {
      // flexFlow: 'row',
      // flexWrap: 'wrap',
      justifyContent: 'space-between',
      padding: [5, 0, 10],
    },
    subPane: {
      // minWidth: 200,
      marginBottom: 20,
    },
  }
}

@view
class Inner {
  render() {
    return (
      <inner $$flex>
        {' '}<Login if={!IN_TRAY} />
        <PlayUI if={true} />
        <TasksUI if={false} />
        <SlotFill.Slot name="sidebar">
          {items =>
            <activeSidebar>
              {items}
            </activeSidebar>}
        </SlotFill.Slot>
      </inner>
    )
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
      <Theme key={0} name="dark">
        <Shortcuts key={1} name="all" handler={store.handleShortcut}>
          <Drawer key={2} open={active} from="right" size={width} zIndex={9}>
            <dragger
              if={!IN_TRAY}
              style={{ WebkitAppRegion: 'no-drag' }}
              ref={this.ref('dragger').set}
            />
            <sidebar>
              <Inner key={0} />
            </sidebar>
          </Drawer>
        </Shortcuts>
      </Theme>
    )
  }

  static style = {
    sidebar: {
      width: '100%',
      userSelect: 'none',
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
