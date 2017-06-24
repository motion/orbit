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
  Badge,
  TiltGlow,
  Button,
  Segment,
  Form,
  Field,
  Grain,
  Glint,
  PassProps,
} from '~/ui'
import { Document } from '@jot/models'
import Login from './login'
import SidebarStore from './store'
import type LayoutStore from '~/stores/layoutStore'
import { IN_TRAY, TRAY_WIDTH, SIDEBAR_TRANSITION } from '~/constants'
import rc from 'randomcolor'
import sillyname from 'sillyname'

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
            <TiltGlow>
              <title $$row>
                <name $$background={rc()}>{player.name}</name>
                <Badge
                  fontFamily="monospace"
                  color={rc({ luminosity: 'light' })}
                  label={sillyname().slice(0, 5).toLowerCase()}
                >
                  {Math.round(Math.random() * 10)}
                </Badge>
                <time>{player.time}</time>
              </title>
              <info>
                <status>{player.status}</status>
              </info>
            </TiltGlow>
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
      padding: [0, 2],
      flex: 1,
      width: '50%',
      minWidth: '50%',
    },
    name: {
      margin: [-2, 5, -2, 0],
      fontWeight: 900,
      width: 30,
      height: 30,
      borderRadius: 100,
      fontSize: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    info: {
      flexFlow: 'row',
      justifyContent: 'space-between',
    },
    status: {
      fontSize: 15,
      padding: [4, 0],
      flex: 1,
      color: [200, 200, 200],
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
    const percentComplete = tasks =>
      100 * tasks.filter(i => i.archive).length / tasks.length

    return (
      <content $$scrollable $$flex={6}>
        <Segment
          $$draggable
          $$flex="none"
          controlled
          $$borderBottom={[1, [255, 255, 255, 0.1]]}
          itemProps={{
            chromeless: true,
            $$flex: 1,
            height: 26,
            borderRadius: 0,
            color: [255, 255, 255, 0.5],
          }}
        >
          <Button active>
            Following
          </Button>
          <Button>
            Recent
          </Button>
        </Segment>

        <tasks>
          <noStars if={!hasDocs}>No Stars</noStars>

          {docs.map((item, i) => {
            const tasks = item.tasks()
            return (
              <section key={i}>
                <title $$row $$spaceBetween>
                  <start $$row $$centered>
                    <Progress.Circle
                      style={{ marginRight: 4 }}
                      lineColor="rgb(130, 248, 198)"
                      backgroundColor={[0, 0, 0, 0.15]}
                      lineWidth={2}
                      size={14}
                      percent={percentComplete(tasks)}
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
                    <path
                      onClick={() => Router.go(item.url())}
                      $$row
                      $$centered
                    >
                      {item.getTitle()}
                    </path>
                  </start>
                  <end>
                    <Icon
                      name="favour3"
                      onClick={item.toggleStar}
                      color="#666"
                    />
                  </end>
                </title>
                <tasks if={tasks && tasks.length}>
                  {tasks.map(({ archive, text, key }, index) =>
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
            )
          })}
        </tasks>

        <empty if={hasDocs} $$draggable />
      </content>
    )
  }

  static style = {
    tasks: {
      padding: [0, 10],
    },
    empty: {
      flex: 1,
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
      fontWeight: 'bold',
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
class Inner {
  render({ store }) {
    const color = '#fff'
    const borderColor = [255, 255, 255, 0.3]
    const paneProps = {
      $mainPane: true,
      collapsable: true,
      titleProps: { color, borderColor },
    }
    return (
      <inner $$flex>
        <Login />

        <Theme if={!store.team} name="dark">
          <modal>
            <Form>
              <PassProps row chromeless placeholderColor="#333">
                <Field label="Name" placeholder="something" />
                <Field label="Email" placeholder="something" />
                <Field label="Password" placeholder="something" />
              </PassProps>
            </Form>
            <Button>
              Next
            </Button>
          </modal>
        </Theme>

        <Projects />

        <Pane
          padding={[0, 10]}
          shadow
          transparent
          background={[40, 40, 40, 0.65]}
          {...paneProps}
          title={<title $$row>Team: <Dropdown>Motion</Dropdown></title>}
        >
          <TeamStatus
            items={[
              {
                name: 'SB',
                status: '#brainstorm: features and user feedback strategy',
                time: '10m',
              },
              {
                name: 'NW',
                status:
                  'editor: performance/stability: general perf, less saving: save only on debounce(1000)',
                time: '10m',
              },
              {
                name: 'NC',
                status: 'editor: formatting: #uxlove + #dev',
                time: '10m',
              },
              {
                name: 'JB',
                status: '#brainstorm: features and user feedback strategy',
                time: '10m',
              },
            ]}
          />
        </Pane>
        <SlotFill.Slot name="sidebar">
          {items =>
            <activeSidebar>
              {items}
            </activeSidebar>}
        </SlotFill.Slot>
      </inner>
    )
  }
  static style = {
    inner: {
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
            transition={SIDEBAR_TRANSITION}
            key={2}
            background="transparent"
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
      background: [70, 70, 70, 0.55],
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
