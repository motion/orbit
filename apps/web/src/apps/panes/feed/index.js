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
class FeedNavBar {
  render({ store }) {
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
        <UI.Button icon="funnel" borderRadius={50}>
          Feed
        </UI.Button>
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
  store: FeedStore,
})
export default class SetView extends React.Component<Props> {
  render({ store }: Props) {
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
          background: '#fff',
          borderRadius: 6,
          boxShadow: [[0, 2, 10, [0, 0, 0, 0.15]]],
        }}
        items={[
          () => <FeedHeader store={store} />,
          () => <FeedRecently />,
          () => <Calendar />,
          () => <FeedNavBar store={store} />,
          ...store.activeItems.map((item, index) => () => (
            <FeedItem
              store={store}
              event={item}
              index={index}
              hideName={
                store.filters.people && store.filters.people[0] === 'Me'
              }
            />
          )),
        ]}
      />
    )
  }
}
