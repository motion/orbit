// @flow
import React from 'react'
import { view, Shortcuts } from '@mcro/black'
import * as UI from '@mcro/ui'
import Login from '../login'
import SidebarStore from './store'
import Projects from './projects'
import Menu from './menu'
import UserBar from './userBar'
import type LayoutStore from '~/stores/layoutStore'
import * as Constants from '~/constants'
import gradients from '~/helpers/gradients'

const idToGradient = id => {
  const num = Math.abs(+`${+id}`.replace(/[^0-9]/g, ''))
  const deg = Math.floor(Math.random() * 120)
  const { colors } = gradients[num % gradients.length]
  return `linear-gradient(${deg}deg, ${colors[0]}, ${colors[1]})`
}

type Props = {
  layoutStore: LayoutStore,
  store: SidebarStore,
}

@view
class SidebarContent {
  render() {
    return (
      <inner $$flex>
        <UI.Glint borderRadius={5} />

        <heading $$draggable $$row css={{ padding: 10 }}>
          <UI.Input circular />
          <div $$flex />
          <UI.Segment itemProps={{ circular: true }}>
            <UI.Button icon="check" />
            <UI.Button icon="mail" />
          </UI.Segment>
        </heading>

        <title
          $$draggable
          css={{
            color: '#fff',
            fontSize: 22,
            fontWeight: 200,
            padding: [20, 0],
            margin: [0, 20],
            borderBottom: [1, [0, 0, 0, 0.1]],
          }}
        >
          My tasks
        </title>
        <contents
          if={false}
          css={{
            margin: 10,
            top: 0,
            right: 0,
            left: 20,
          }}
        >
          <UI.Segment>
            {['Docs', 'Tasks'].map((text, i) =>
              <UI.Button
                key={i}
                active={i === 0}
                borderWidth={1}
                borderColor={[255, 255, 255, 0.15]}
                glowProps={{ opacity: 0.1 }}
                glint={false}
                flex
                background="transparent"
                css={{
                  //backdropFilter: 'blur(5px)',
                }}
              >
                {text}
              </UI.Button>
            )}
          </UI.Segment>
        </contents>
        <rest $$flex>
          <Projects />
        </rest>
        <UserBar />
      </inner>
    )
  }
}

@view.attach('layoutStore', 'explorerStore')
@view({
  store: SidebarStore,
})
export default class Sidebar {
  render({ explorerStore, layoutStore, store }: Props) {
    const active = Constants.IN_TRAY ? true : layoutStore.sidebar.active
    const width = Constants.IN_TRAY
      ? Constants.TRAY_WIDTH
      : layoutStore.sidebar.width

    return (
      <UI.Theme key={0} name="clear-dark">
        <Shortcuts key={1} name="all" handler={store.handleShortcut}>
          <UI.Drawer
            zIndex={1}
            transition={Constants.SIDEBAR_TRANSITION}
            background="transparent"
            key={2}
            open={active}
            from="right"
            size={width + 20}
          >
            <sidebar>
              <sidebarcontent>
                <SidebarContent />
              </sidebarcontent>

              <UI.Theme name="light" if={false}>
                <UI.Drawer
                  open={explorerStore.showDiscussions}
                  from="left"
                  size={width + 20}
                  background="#fefefe"
                  css={{
                    paddingLeft: 20,
                  }}
                  zIndex={100}
                  transition
                  scrollable
                >
                  <docdrawer>hi</docdrawer>
                </UI.Drawer>
              </UI.Theme>
            </sidebar>
          </UI.Drawer>
        </Shortcuts>
      </UI.Theme>
    )
  }

  static style = {
    sidebar: {
      overflow: 'hidden',
      userSelect: 'none',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    sidebarcontent: {
      marginLeft: 20,
      flex: 1,
    },
  }
}
