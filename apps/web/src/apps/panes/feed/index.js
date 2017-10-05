// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Pane from '~/apps/pane'
import type { PaneProps } from '~/types'
// import Calendar from '../views/calendar'
import FeedItem from './feedItem'
import FeedStore from './feedStore'
import Chart from './chart'
import _, { capitalize, isUndefined } from 'lodash'

type Props = PaneProps & { store: FeedStore }

const hourOffset = hour => hour - 10
const colors = ['green', 'red', 'blue', 'orange', 'purple']
const rc = () => colors[Math.floor(colors.length * Math.random())]

@view
class Calendar {
  render() {
    return (
      <calendar>
        <controls $$row>
          <UI.Row>
            <UI.Button icon="arrowminleft" />
            <UI.Button>Tues, Jan 12th</UI.Button>
            <UI.Button icon="arrowminright" />
          </UI.Row>
          <div css={{ marginRight: 10 }} />
          <UI.Row>
            <UI.Button>Week</UI.Button>
            <UI.Button>Month</UI.Button>
          </UI.Row>
        </controls>
        <currentTime $atTime={11}>
          <dot />
        </currentTime>
        <events>
          <event $$background={rc()} $atTime={11}>
            <title>Meet carol</title>
            <sub $$ellipse>Something or other</sub>
          </event>
          <event $$background={rc()} $atTime={11} $hours={2} $offset={1}>
            <title>Meet carol</title>
            <sub $$ellipse>Something or other</sub>
          </event>
          <event $$background={rc()} $atTime={11} $hours={2} $offset={2}>
            <title>Meet carol</title>
            <sub $$ellipse>Something or other</sub>
          </event>
          <event $$background={rc()} $atTime={13} $offset={1}>
            <title>Meet carol</title>
            <sub $$ellipse>Something or other</sub>
          </event>
          <event $$background={rc()} $atTime={14} $offset={2}>
            <title>Meet carol</title>
            <sub $$ellipse>Something or other</sub>
          </event>
          <event $$background={rc()} $atTime={14} $hours={2}>
            <title>Meet carol</title>
            <sub $$ellipse>Something or other</sub>
          </event>
          <event $$background={rc()} $atTime={15}>
            <title>Meet carol</title>
            <sub $$ellipse>Something or other</sub>
          </event>
          <event $$background={rc()} $atTime={17}>
            <title>Meet carol</title>
            <sub $$ellipse>Something or other</sub>
          </event>
        </events>
        <period>
          {[10, 11, 12, 13, 14, 15, 16, 17].map(time => (
            <mark key={time} $atTime={time} />
          ))}
        </period>
        <hours>
          {[10, 11, 12, 13, 14, 15, 16, 17].map(time => (
            <hourMark key={time} $atTime={time}>
              {time % 12}
              {time > 12 ? 'pm' : 'am'}
            </hourMark>
          ))}
        </hours>
      </calendar>
    )
  }

  static style = {
    calendar: {
      height: 180,
      position: 'relative',
      borderTop: [1, '#eee'],
      borderBottom: [1, '#eee'],
      margin: [0, -20],
      flex: 1,
    },
    controls: {
      position: 'fixed',
      top: -13,
      left: 20,
      zIndex: 100,
    },
    currentTime: {
      width: 4,
      background: 'black',
      bottom: 5,
      top: 0,
      position: 'absolute',
      zIndex: 12,
      boxShadow: [[0, 0, 10, [0, 0, 0, 0.1]]],
    },
    dot: {
      width: 12,
      height: 12,
      marginLeft: -6,
      position: 'absolute',
      bottom: -5,
      left: '50%',
      right: 0,
      alignItems: 'center',
      borderRadius: 1000,
      background: 'black',
    },
    atTime: hour => ({
      position: 'absolute',
      border: '10px red',
      left: hourOffset(hour) * 100,
    }),
    events: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10,
      top: 30,
    },
    event: {
      width: 100,
      height: 40,
      background: 'green',
      color: '#fff',
      padding: [5, 10],
      borderRadius: 10,
      lineHeight: '1rem',
    },
    sub: {
      fontSize: '80%',
      opacity: 0.5,
    },
    offset: x => ({
      top: 45 * x,
    }),
    hours: x => ({
      width: 100 * x,
    }),
    period: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 8,
    },
    mark: {
      bottom: 0,
      top: 0,
      width: 1,
      background: [0, 0, 0, 0.05],
    },
    hourMark: {
      color: '#000',
      opacity: 0.3,
      bottom: 0,
      padding: [0, 0, 0, 5],
      fontSize: 12,
    },
  }
}

@view
class FeedNavBar {
  render({ store }) {
    return (
      <UI.Row
        stretch
        css={{
          margin: [0, -10, 10],
          borderBottom: [1, [0, 0, 0, 0.1]],
        }}
        itemProps={{
          size: 1.1,
          height: 42,
          borderWidth: 0,
          highlightBackground: '#000',
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

    // CALENDAR
    // false && store.filters.type === 'calendar'
    //   ? () => (
    //       <section
    //         if={store.filters.type === 'calendar'}
    //         css={{ width: '100%' }}
    //       >
    //         <div
    //           $$row
    //           css={{
    //             width: '100%',
    //             alignItems: 'flex-start',
    //             maxHeight: '100%',
    //           }}
    //         >
    //           <Calendar isSmall={!store.calendarActive} />
    //         </div>
    //       </section>
    //     )
    //   : null,

    return (
      <Pane.Card
        theme="light"
        css={{
          borderRadius: 5,
        }}
        items={[
          () => (
            <section
              $$row
              css={{ padding: [26, 15, 25], alignItems: 'flex-end' }}
            >
              <title css={{ flex: 1, justifyContent: 'flex-end' }}>
                <main>
                  <UI.Title
                    onClick={store.ref('isOpen').toggle}
                    size={1.8}
                    fontWeight={800}
                    color="#000"
                  >
                    Feed
                  </UI.Title>
                </main>

                <sub>
                  {store.filters.people.map(person => (
                    <person $$row css={{ marginRight: 20 }}>
                      <UI.Text size={1.3}>{person}</UI.Text>
                    </person>
                  ))}
                </sub>
              </title>

              <aside css={{ maxHeight: 55 }}>
                <cardsFade
                  $$fullscreen
                  css={{
                    top: '80%',
                    background:
                      'linear-gradient(transparent, rgba(0,0,0,0.05))',
                  }}
                />

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
            </section>
          ),
          () => <Calendar />,
          //() => <FeedNavBar store={store} />,
          () => (
            <UI.Title margin={[35, 0, 0, 15]} color="#000" fontWeight="800">
              Recently
            </UI.Title>
          ),
          ...store.activeItems.map(item => () => (
            <FeedItem store={store} event={item} />
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
