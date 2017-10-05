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
          margin: [0, -10],
        }}
        itemProps={{
          size: 1,
          borderWidth: 0,
          height: 36,
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

    return (
      <Pane.Card
        theme="light"
        css={{
          borderRadius: 5,
        }}
        items={[
          () => (
            <section $$row css={{ padding: [15, 15] }}>
              {store.filters.people.map(person => (
                <person $$row css={{ marginRight: 20 }}>
                  <UI.Title onClick={store.ref('isOpen').toggle} size={2}>
                    {person}
                  </UI.Title>
                </person>
              ))}
            </section>
          ),
          () => <FeedNavBar store={store} />,
          () => (
            <section>
              <chart className="chart">
                <Chart store={store} />
              </chart>
            </section>
          ),
          store.filters.type === 'calendar'
            ? () => (
                <section
                  if={store.filters.type === 'calendar'}
                  css={{ width: '100%' }}
                >
                  <div
                    $$row
                    css={{
                      width: '100%',
                      alignItems: 'flex-start',
                      maxHeight: '100%',
                    }}
                  >
                    <Calendar isSmall={!store.calendarActive} />
                  </div>
                </section>
              )
            : null,
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
      padding: [6, 15],
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
