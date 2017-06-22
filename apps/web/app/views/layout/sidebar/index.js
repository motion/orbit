// @flow
import React from 'react'
import { view, ViewType } from '@jot/black'
import { Shortcuts } from '~/helpers'
import { flatMap } from 'lodash'
import {
  Theme,
  Drawer,
  Pane,
  Icon,
  Input,
  Dropdown,
  Progress,
  SlotFill,
} from '~/ui'
import { Document } from '@jot/models'
import Login from '../login'
import SidebarStore from './store'
import type LayoutStore from '~/stores/layoutStore'
import { IN_TRAY, TRAY_WIDTH } from '~/constants'

type Props = {
  layoutStore: LayoutStore,
  store: SidebarStore,
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
      margin: [0, -4],
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

@view({
  store: class SidebarProjectStore {
    docs = Document.stars()
  },
})
class Projects {
  render({ store }) {
    const docs = store.docs || []
    const hasDocs = docs.length !== 0

    return (
      <content $$scrollable $$flex={6}>
        <noStars if={!hasDocs}>No Stars</noStars>

        {docs.map((item, i) =>
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
                <path if={false} $$row $$centered>
                  {flatMap(
                    item.title.map((tit, index) =>
                      <fade key={index}>{tit}</fade>
                    ),
                    (value, index, arr) =>
                      arr.length !== index + 1
                        ? [value, <sep key={Math.random()}>/</sep>]
                        : value
                  )}
                </path>
                <path onClick={() => Router.go(item.url())} $$row $$centered>
                  {item.getTitle()}
                </path>
              </start>
              <end>
                <Icon name="favour3" onClick={item.toggleStar} color="#666" />
              </end>
            </title>
            <tasks>
              {item.tasks().map(({ archive, text, key }, index) =>
                <task key={key} $$row>
                  <Input
                    $check
                    onChange={() => item.toggleTask(text)}
                    type="checkbox"
                    checked={archive}
                  />{' '}
                  <span $$ellipse>{text}</span>
                </task>
              )}
            </tasks>
          </section>
        )}

        <empty if={hasDocs} $$draggable />
      </content>
    )
  }

  static style = {
    content: {
      padding: [10, 8],
    },
    empty: {
      height: '100%',
    },
    section: {
      margin: [6, 0],
      padding: [0, 5],
    },
    noStars: {
      fontSize: 24,
      flex: 1,
      textAlign: 'center',
      justifyContent: 'center',
      color: '#888',
    },
    title: {
      padding: [0, 5],
      marginLeft: -5,
    },
    path: {
      marginLeft: 4,
      fontSize: 17,
      lineHeight: 1,
    },
    fade: {
      opacity: 1,
      pointer: 'pointer',
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
      margin: [0, 2],
      fontWeight: 100,
      color: [255, 255, 255, 0.2],
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
    const color = '#fff'
    const borderColor = [255, 255, 255, 0.3]
    const paneProps = {
      $mainPane: true,
      collapsable: true,
      titleProps: { color, borderColor },
    }
    return (
      <ui>
        <Projects />
        <Pane
          padding={[0, 10]}
          shadow
          transparent
          background={[0, 0, 0, 0.1]}
          {...paneProps}
          title={<title $$row>Team: <Dropdown>Motion</Dropdown></title>}
        >

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
        </Pane>
      </ui>
    )
  }
  static style = {
    ui: {
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
        <Login />
        <PlayUI />
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
            background={[20, 20, 20, 0.68]}
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
      overflow: 'hidden',
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
