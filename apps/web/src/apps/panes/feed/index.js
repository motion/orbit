// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Pane from '~/apps/panes/pane'
import type { PaneProps } from '~/types'
import Calendar from '../calendar'
import FeedItem from './feedItem'
import FeedStore from './feedStore'
import Chart from './chart'
import { capitalize, isUndefined } from 'lodash'

type Props = PaneProps & { store: FeedStore }

@view
class ItemsSection {
  render({ store }) {
    return (
      <UI.Row stretch itemProps={{ size: 1, borderWidth: 0, glint: false }}>
        {store.types.map(type => {
          const highlight =
            (isUndefined(type.type) ? type.name : type.type) ===
            store.filters.type
          return (
            <UI.Button
              key={type}
              icon={type.icon}
              background={highlight ? null : [255, 255, 255, 0.1]}
              highlight={highlight}
              padding={[0, 15]}
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
export default class SetView extends React.PureComponent<Props> {
  render({ store }: Props) {
    // return <h4>team page</h4>
    if (!store.allItems.length) {
      return (
        <div $$padded>
          <UI.FakeText lines={5} />
        </div>
      )
    }

    const avatar = s => `/images/${s === 'nate' ? 'me' : s}.jpg`

    return (
      <Pane.Card
        items={[
          () => (
            <section $$row>
              {store.filters.people.map(person => (
                <person $$row css={{ marginRight: 20 }}>
                  <img $image src={avatar(person)} />
                  <UI.Title onClick={store.ref('isOpen').toggle} size={2}>
                    {person}
                  </UI.Title>
                </person>
              ))}
            </section>
          ),
          () => <ItemsSection store={store} />,
          () => (
            <info css={{ marginLeft: 30 }}>
              <chart className="chart">
                <Chart store={store} />
              </chart>
            </info>
          ),
          false &&
            store.filters.type === 'calendar' && {
              view: () => (
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
              ),
            },
          ...store.activeItems.map(item => () => (
            <FeedItem store={store} event={item} />
          )),
        ].filter(i => !!i)}
      />
    )
  }

  static style = {
    section: {
      padding: [4, 10],
      justifyContent: 'center',
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
