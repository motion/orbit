// @flow
import React from 'react'
import { view, watch, Shortcuts } from '@mcro/black'
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
} from '@mcro/ui'
import { Document } from '@mcro/models'
import Login from './login'
import Signup from './signup'
import SidebarStore from './store'
import type LayoutStore from '~/stores/layoutStore'
import { IN_TRAY, TRAY_WIDTH, SIDEBAR_TRANSITION } from '~/constants'
import rc from 'randomcolor'
import Router from '~/router'
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
            <title>
              <Badge
                $badge
                labelBefore
                fontFamily="monospace"
                color={rc({ luminosity: 'light' })}
                label={sillyname().slice(0, 15).toLowerCase()}
              >
                {player.name}
              </Badge>
              <time>{player.time}</time>
            </title>
            <info>
              {player.status}
            </info>
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
      padding: [5, 10],
      flex: 1,
      width: '100%',
      minWidth: '100%',
      borderTop: [1, [255, 255, 255, 0.05]],
    },
    title: {
      flexFlow: 'row',
    },
    badge: {
      marginRight: 5,
    },
    info: {
      flexFlow: 'row',
      justifyContent: 'space-between',
      padding: [5, 0],
      fontSize: 12,
      lineHeight: '17px',
      flex: 1,
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
    crumbs = watch(
      () => this.docs && Promise.all(this.docs.map(doc => doc.getCrumbs()))
    )
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
        <TeamStatus
          if={false}
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

        <Segment
          if={false}
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

        <noStars $$flex if={!hasDocs}>No Stars</noStars>

        <tasks if={hasDocs}>
          {docs.map((doc, index) => {
            const tasks = doc.tasks()
            return (
              <section key={index}>
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
                        doc.title.map((tit, index) =>
                          <fade key={index}>{tit}</fade>
                        ),
                        (value, index, arr) =>
                          arr.length !== index + 1
                            ? [value, <sep key={Math.random()}>/</sep>]
                            : value
                      )}
                    </path>
                    <path onClick={() => Router.go(doc.url())} $$row $$centered>
                      {(store.crumbs &&
                        store.crumbs[index] &&
                        store.crumbs[index]
                          .map(doc => doc.getTitle())
                          .join(' / ')) ||
                        doc.getTitle()}
                    </path>
                  </start>
                  <end>
                    <Icon
                      name="favour3"
                      onClick={doc.toggleStar}
                      color="#666"
                    />
                  </end>
                </title>
                <tasks if={tasks && tasks.length}>
                  {tasks.map(({ archive, text, key }, index) =>
                    <task key={key} $$row>
                      <Input
                        $check
                        onChange={() => doc.toggleTask(text)}
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
      padding: [10, 10],
    },
    empty: {
      flex: 1,
    },
    section: {
      margin: [6, 0],
      padding: [0, 5],
    },
    noStars: {
      fontWeight: 200,
      fontSize: 16,
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
    return (
      <inner $$flex>
        <Login />
        <Signup />

        <Theme name="dark">
          <modal>
            <Form>
              <PassProps row chromeless placeholderColor="#333">
                <Field label="Name" placeholder="something" />
                <Field label="Email" placeholder="something" />
                <Field label="Password" placeholder="something" />
              </PassProps>
              <Button>
                Signup
              </Button>
            </Form>
          </modal>
        </Theme>

        <Projects />

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
  render({ layoutStore, store }: Props) {
    const active = IN_TRAY ? true : layoutStore.sidebar.active
    const width = IN_TRAY ? TRAY_WIDTH : layoutStore.sidebar.width

    return (
      <Theme name="dark">
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
      borderLeft: `1px solid #666`,
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
