// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Pane from '~/apps/pane'
import type { PaneProps } from '~/types'
import Calendar from './calendar'
import FeedItem from './feedItem'
import FeedStore from './feedStore'
import { capitalize, isUndefined } from 'lodash'

type Props = PaneProps & { store: FeedStore }

@view
class FeedNavBar {
  render({ store }) {
    return (
      <UI.Row
        stretch
        css={{
          margin: [0, -10, 10],
          background: '#eee',
        }}
        itemProps={{
          size: 1,
          height: 42,
          borderWidth: 0,
          highlightBackground: '#fff',
          highlightColor: '#000',
        }}
      >
        {store.types.map(type => {
          const highlight =
            (isUndefined(type.type) ? type.name : type.type) ===
            store.filters.type
          return (
            <UI.Button
              key={type}
              icon={type.icon}
              highlight={highlight}
              glow={!highlight}
              padding={[0, 15]}
              borderRadius={0}
              opacity={highlight ? 1 : 0.5}
              css={{
                borderBottom: [1, 'solid', '#fff'],
                borderColor: highlight ? 'transparent' : '#eee',
              }}
              onClick={() => {
                store.setFilter(
                  'type',
                  isUndefined(type.type) ? type.name : type.type
                )
              }}
            >
              {capitalize(type.name)}
            </UI.Button>
          )
        })}
      </UI.Row>
    )
  }
}

@view.attach('barStore')
@view({
  store: FeedStore,
})
export default class SetView extends React.Component<Props> {
  render({ store }: Props) {
    // return <h4>team page</h4>
    if (!store.allItems.length) {
      return (
        <div $$padded>
          <UI.FakeText lines={5} />
        </div>
      )
    }

    // CHART
    // false && () => (
    //   <section>
    //     <chart className="chart">
    //       <Chart store={store} />
    //     </chart>
    //   </section>
    // ),

    return (
      <Pane.Card
        theme="light"
        css={{
          borderRadius: 5,
          boxShadow: [[0, 2, 10, [0, 0, 0, 0.15]]],
        }}
        items={[
          () => (
            <section
              $$row
              css={{ padding: [10, 15, 0], alignItems: 'flex-end' }}
            >
              <title
                css={{
                  paddingTop: 30,
                  paddingBottom: 25,
                  flex: 1,
                  justifyContent: 'flex-end',
                }}
              >
                <main>
                  <UI.Title
                    onClick={store.ref('isOpen').toggle}
                    size={1.8}
                    fontWeight={800}
                    color="#000"
                  >
                    {store.filters.people.length === 1
                      ? store.filters.people[0]
                      : 'Feed'}
                  </UI.Title>
                </main>

                <sub if={store.filters.people.length > 1}>
                  {store.filters.people.map(person => (
                    <person $$row css={{ marginRight: 20 }}>
                      <UI.Text size={1.3}>{person}</UI.Text>
                    </person>
                  ))}
                </sub>
              </title>

              <cardsFade
                if={false}
                $$fullscreen
                css={{
                  top: '85%',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.04))',
                  //left: '50%',
                }}
              />

              <rightSide
                css={{
                  position: 'relative',
                  height: '100%',
                  lineHeight: '1.2rem',
                }}
              >
                <aside css={{ maxHeight: 55 }}>
                  <card
                    css={{
                      flexShrink: 0,
                      borderRadius: 8,
                      padding: [5, 10],
                      border: [1, 'dashed', [0, 0, 0, 0.15]],
                    }}
                  >
                    <content $$row css={{ alignItems: 'center' }}>
                      <avatar
                        css={{
                          width: 50,
                          height: 50,
                          marginRight: 15,
                          borderRadius: 1000,
                          background: 'url(/images/me.jpg)',
                          backgroundSize: 'cover',
                        }}
                      />
                      <stats css={{ padding: [10, 0] }}>
                        <stat css={{ fontWeight: 600, color: '#333' }}>
                          Nate Wienert
                        </stat>
                        <stat>natewienert@gmail.com</stat>
                        <stat>Teams: Motion</stat>
                      </stats>
                    </content>
                  </card>
                </aside>
              </rightSide>
            </section>
          ),
          () => <Calendar />,
          //() => (
          //  <UI.Title margin={[15, 0, 0, 15]} color="#000" fontWeight="800">
          //    Recently
          //  </UI.Title>
          //),
          () => <FeedNavBar store={store} />,
          ...store.activeItems.map(item => () => (
            <FeedItem
              store={store}
              event={item}
              hideName={
                store.filters.people && store.filters.people[0] === 'Me'
              }
            />
          )),
        ]}
      />
    )
  }

  static style = {
    section: {
      flex: 1,
      padding: [0, 15],
    },
    image: {
      width: 30,
      height: 30,
      borderRadius: 1000,
      margin: 'auto',
      marginRight: 10,
    },
  }
}
