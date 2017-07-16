// @flow
import React from 'react'
import { view, Shortcuts } from '@mcro/black'
import * as UI from '@mcro/ui'
import SidebarStore from './store'
import Projects from './projects'
import UserBar from './userBar'
import type LayoutStore from '~/stores/layoutStore'
import * as Constants from '~/constants'

type Props = {
  layoutStore: LayoutStore,
  store: SidebarStore,
}

@view
export default class Notifications {
  render() {
    return (
      <inner $$flex>
        <UI.Glint borderRadius={5} />

        <heading $$draggable $$row css={{ padding: 10 }}>
          <UI.Input circular flex={1} />
          <div $$flex />
          <UI.Segment
            itemProps={{ borderRadius: 15, size: 0.9, sizePadding: 1.5 }}
          >
            <UI.Button active icon="chat">
              Threads
            </UI.Button>
            <UI.Button icon="bell">Following</UI.Button>
          </UI.Segment>
        </heading>

        <title
          if={false}
          $$draggable
          css={{
            color: '#fff',
            fontSize: 22,
            fontWeight: 200,
            padding: [14, 0],
            margin: [0, 20, 8],
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
