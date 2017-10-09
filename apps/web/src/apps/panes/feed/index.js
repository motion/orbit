// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Pane from '~/apps/pane'
import type { PaneProps } from '~/types'
import Calendar from './calendar'
import FeedItem from './feedItem'
import FeedStore from './feedStore'
import FeedHeader from './feedHeader'
import FeedRecently from './feedRecently'
import { SubTitle } from '~/views'

type Props = PaneProps & { store: FeedStore }


@view
class FeedFilters {
  render({ store }) {
    return (
      <UI.List
        stretch
        css={{
          margin: [0, 10],
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
            <UI.ListItem
              key={type}
              icon={type.icon}
              highlight={highlight}
              highlightBackground={[0, 0, 0, 0.1]}
              glow={!highlight}
              padding={[0, 15]}
              onClick={() => {
                store.setFilter(
                  'type',
                  isUndefined(type.type) ? type.name : type.type
                )
              }}
            >
              {capitalize(type.name)}
            </UI.ListItem>
          )
        })}
      </UI.Row>
    )
  }
}

@view
class FeedNavBar {
  render() {
    return (
      <navbar>
        <line
          css={{
            background: 'linear-gradient(to right, #fff, rgba(0,0,0,0.08))',
            position: 'absolute',
            zIndex: -1,
            height: 1,
            top: '50%',
            left: 0,
            right: 0,
            marginTop: -0.5,
          }}
        />
        <UI.Popover
          target={
            <UI.Button icon="funnel" borderRadius={50}>
              Feed
            </UI.Button>
          }
        >
          <FeedFilters />
        </UI.Popover>
      </navbar>
    )
  }
  static style = {
    navbar: {
      flex: 1,
      padding: [10, 25],
      marginTop: 15,
      flexFlow: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      position: 'relative',
    },
  }
}

@view.attach('barStore')
@view({
  feedStore: FeedStore,
})
export default class SetView extends React.Component<Props> {
  render({ feedStore }: Props) {
    if (!feedStore.allItems.length) {
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
          background: '#fff',
          borderRadius: 6,
          boxShadow: [[0, 2, 10, [0, 0, 0, 0.15]]],
        }}
        items={[
          () => <FeedHeader feedStore={feedStore} />,
          () => <FeedRecently />,
          () => <Calendar />,
          () => <FeedNavBar />,
          ...feedStore.activeItems.map((item, index) => () => (
            <FeedItem
              event={item}
              index={index}
              hideName={
                feedStore.filters.people && feedStore.filters.people[0] === 'Me'
              }
            />
          )),
        ]}
      />
    )
  }
}
