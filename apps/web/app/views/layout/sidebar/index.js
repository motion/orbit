// @flow
import React from 'react'
import { view, ViewType } from '@jot/black'
import { Shortcuts } from '~/helpers'
import { flatMap } from 'lodash'
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
  Progress,
  SlotFill,
} from '~/ui'
import { User, Place } from '@jot/models'
import Login from '../login'
import Team from './team'
import SidebarStore from './store'
import type LayoutStore from '~/stores/layoutStore'
import { IN_TRAY, TRAY_WIDTH } from '~/constants'
import Tasks from './tasks'
import TaskItem from './taskItem'

type Props = {
  layoutStore: LayoutStore,
  store: SidebarStore,
}

@view({
  store: class {
    inProgress = true
  },
})
class TasksUI {
  render({ store }) {
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
  render({ items }) {
    return (
      <team>
        {items.map(player =>
          <player key={player.name}>
            <card>
              <name>{player.name}</name>
              <info>
                <status $$ellipse>{player.status}</status>
                <time if={false}>{player.time}</time>
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
      borderBottom: [1, [0, 0, 0, 0.25]],
      margin: [0, -4, 10],
      padding: [2, 0],
    },
    player: {
      width: '50%',
      padding: 2,
    },
    card: {
      borderRadius: 8,
      padding: [8, 12],
      '&:hover': {
        background: [0, 0, 0, 0.1],
      },
    },
    name: {
      margin: [0, 0, -2, 0],
      fontWeight: 600,
    },
    info: {
      flexFlow: 'row',
      justifyContent: 'space-between',
    },
    status: {
      fontSize: 12,
      opacity: 0.4,
      maxWidth: '100%',
    },
    time: {
      fontSize: 10,
      opacity: 0.2,
    },
  }
}

@view
class Projects {
  items = [
    {
      title: ['Me', 'Drafts'],
      items: ['Lorem ipsum dolor sit amet', 'Segunda ipsum dolor sit amet'],
    },
    {
      title: ['Pundle', '2.0'],
      items: [
        '#brainstorm: features and user feedback strategy',
        'editor: performance/stability: general perf, less saving: save only on debounce(1000)',
        'editor: formatting: #uxlove + #dev',
      ],
    },
    {
      title: ['UI'],
      items: [
        'release: deploy to iwritey.com get working',
        'investigate multi-list drag/drop (dnd)',
      ],
    },
    {
      title: ['Ideas', 'Incoming'],
      items: ['Lorem ipsum dolor sit amet', 'Segunda ipsum dolor sit amet'],
    },
  ]

  render() {
    return (
      <content $$scrollable $$flex={6}>
        {this.items.map((item, i) =>
          <section key={i}>
            <title $$row $$spaceBetween>
              <start $$row $$centered>
                <Progress.Circle
                  style={{ marginRight: 4 }}
                  lineColor="rgb(130, 248, 198)"
                  backgroundColor={[0, 0, 0, 0.15]}
                  lineWidth={2}
                  size={14}
                  percent={Math.random() * 100}
                />
                <pname $$row $$centered>
                  {flatMap(
                    item.title.map((tit, index) =>
                      <fade key={index}>{tit}</fade>
                    ),
                    (value, index, arr) =>
                      arr.length !== index + 1
                        ? [value, <sep key={Math.random()}>/</sep>]
                        : value
                  )}
                </pname>
              </start>
              <end>
                <Icon name="favour3" color="#666" />
              </end>
            </title>
            <tasks>
              {item.items.map((task, index) =>
                <task key={index} $$row>
                  <Input $check type="checkbox" /> <span $$ellipse>{task}</span>
                </task>
              )}
            </tasks>
          </section>
        )}
      </content>
    )
  }

  static style = {
    content: {
      margin: [10, 0],
    },
    section: {
      margin: [0, 0, 10],
    },
    title: {
      padding: 0,
    },
    pname: {
      marginLeft: 5,
      fontSize: 16,
    },
    fade: {
      opacity: 0.8,
      '&:hover': {
        opacity: 1,
      },
    },
    tasks: {
      padding: [10, 5],
    },
    task: {
      padding: [3, 0, 2],
      pointerEvents: 'auto',
      overflow: 'hidden',
    },
    check: {
      margin: [0, 8, 0, 0],
    },
    sep: {
      margin: [0, 4],
      fontWeight: 600,
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
        <TeamStatus
          items={[
            {
              name: 'Steel',
              status: '#brainstorm: features and user feedback strategy',
              time: '10m',
            },
            {
              name: 'Nate',
              status:
                'editor: performance/stability: general perf, less saving: save only on debounce(1000)',
              time: '10m',
            },
            {
              name: 'Nick',
              status: 'editor: formatting: #uxlove + #dev',
              time: '10m',
            },
            {
              name: 'Jacob',
              status: '#brainstorm: features and user feedback strategy',
              time: '10m',
            },
          ]}
        />

        <TeamStatus
          if={false}
          items={[
            {
              name: 'Pundle 2',
              status: <Progress.Bar percent="50" />,
            },
            { name: 'Jot App', status: <Progress.Bar percent="30" /> },
            { name: 'TSNE Server', status: <Progress.Bar percent="10" /> },
            { name: 'Housekeeping', status: <Progress.Bar percent="90" /> },
          ]}
        />

        <Segment if={false} controlled itemProps={{ $$flex: 1 }}>
          <Button>tasks</Button>
          <Button>docs</Button>
        </Segment>

        <Projects />

        <content if={false} $$scrollable $$flex={6}>
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

        <Pane if={false} {...paneProps} title="Queue">
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
        <TasksUI />
        <PlayUI if={true} />
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
          <Drawer
            transition="none"
            background={[0, 0, 0, 0.5]}
            key={2}
            open={active}
            from="right"
            size={width}
            zIndex={9}
          >
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
