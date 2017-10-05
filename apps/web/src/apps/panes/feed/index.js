// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Pane from '~/apps/pane'
import type { PaneProps } from '~/types'
import Calendar from '../views/calendar'
import FeedItem from './feedItem'
import FeedStore from './feedStore'
import Chart from './chart'
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
              css={{ padding: [26, 15, 18], alignItems: 'flex-end' }}
            >
              {store.filters.people.map(person => (
                <person $$row css={{ marginRight: 20 }}>
                  <UI.Title
                    onClick={store.ref('isOpen').toggle}
                    size={1.8}
                    fontWeight={800}
                    color="#000"
                  >
                    {person}
                  </UI.Title>
                </person>
              ))}
            </section>
          ),
          () => <FeedNavBar store={store} />,
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
