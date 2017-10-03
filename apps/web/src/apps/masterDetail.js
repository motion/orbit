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
        <header $$draggable $$flex css={{ height: 40, background: '#fff' }} />
        <UI.Surface flex padding={20}>
          <UI.Title size={2} fontWeight={800} color="#000">
            My Day
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
              icon: '123',
            })}
          />

          <br />

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

          <br />

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

          <br />

          <UI.Title size={1} fontWeight={800} color="#000">
            Documents
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
              icon: 'doc',
            })}
          />
        </UI.Surface>
      </UI.Theme>
    )

    return (
      <UI.Surface flex>
        <UI.Theme name="light">
          <container>
            <UI.Button onClick={this.onClose}>close me</UI.Button>
            <Miller
              animate
              search={''}
              state={store.millerState}
              panes={Panes}
              onChange={store.onMillerStateChange}
              paneProps={paneProps}
            />
          </container>
        </UI.Theme>
      </UI.Surface>
    )
  }

  static style = {
    container: {
      flex: 1,
    },
  }
}
