import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Panes from './panes'
import { Miller } from './miller'

@view
export default class MasterPage {
  render() {
    const paneProps = {
      highlightBackground: [0, 0, 0, 0.15],
      highlightColor: [255, 255, 255, 1],
    }

    return (
      <UI.Theme name="light">
        <UI.Surface flex padding={[30, 20, 20]}>
          <UI.Title size={2} fontWeight={800} color="#000">
            My Day
          </UI.Title>

          <section>
            <UI.List
              items={[1, 2]}
              itemProps={{
                size: 1.3,
                padding: [12, 10],
                highlightBackground: [0, 0, 0, 0.08],
                highlightColor: [255, 255, 255, 1],
              }}
              getItem={item => ({
                primary: 'Hello world',
                children: 'lorem ipsum dolor sit amet.',
                icon: '123',
              })}
            />
          </section>

          <section>
            <UI.Title size={1} fontWeight={800} color="#000">
              Team
            </UI.Title>
            <UI.List
              items={[1, 2]}
              itemProps={{
                size: 1.3,
                padding: [12, 10],
                highlightBackground: [0, 0, 0, 0.08],
                highlightColor: [255, 255, 255, 1],
              }}
              getItem={item => ({
                primary: 'Hello world',
                children: 'lorem ipsum dolor sit amet.',
                icon: 'team',
              })}
            />
          </section>

          <section>
            <UI.Title size={1} fontWeight={800} color="#000">
              Conversations
            </UI.Title>
            <UI.List
              items={[1]}
              itemProps={{
                size: 1.3,
                padding: [12, 10],
                highlightBackground: [0, 0, 0, 0.08],
                highlightColor: [255, 255, 255, 1],
              }}
              getItem={item => ({
                primary: 'Hello world',
                children: 'lorem ipsum dolor sit amet.',
                icon: 'chat',
              })}
            />
          </section>

          <div css={{ flex: 1 }} />

          <section>
            <UI.Title size={1} fontWeight={800} color="#000">
              Documents
            </UI.Title>
            <div
              $$row
              css={{
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: [10, 20],
              }}
            >
              <UI.Icon color="blue" size={30} name="gdoc" />
              <UI.Icon color="red" size={30} name="doc" />
              <UI.Icon color="yellow" size={30} name="google" />
              <UI.Icon color="green" size={30} name="paper" />
            </div>
          </section>

          <bottom $$row $$centered>
            <UI.Button circular size={2} icon="speak" />
          </bottom>
        </UI.Surface>
      </UI.Theme>
    )
  }

  static style = {
    container: {
      flex: 1,
    },
    section: {
      marginBottom: 20,
    },
  }
}
