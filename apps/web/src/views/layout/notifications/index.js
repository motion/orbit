// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Projects from './projects'
import UserBar from './userBar'

@view
export default class Notifications {
  render() {
    return (
      <inner css={{ padding: [13, 0, 23, 10] }} $$flex>
        <UI.Glint borderRadius={5} />

        <heading $$draggable $$row css={{ padding: [0, 10] }}>
          <UI.Title opacity={0.5} $$flex>
            Following
          </UI.Title>
          <UserBar />
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
          <UI.Row>
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
          </UI.Row>
        </contents>
        <rest $$flex>
          <Projects />
        </rest>
      </inner>
    )
  }
}
