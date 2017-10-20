// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Pane from '../pane'
import type { PaneProps } from '~/types'
import { Thing } from '~/app'
import Calendar from './calendar'
import FeedItem from './feedItem'
import FeedStore from './feedStore'
import FeedHeader from './feedHeader'
// import FeedRecently from './feedRecently'
import { isUndefined, capitalize } from 'lodash'

type Props = PaneProps & { store: FeedStore }

@view
class FeedFilters {
  render({ feedStore }) {
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
        {feedStore.types.map(type => {
          const highlight =
            (isUndefined(type.type) ? type.name : type.type) ===
            feedStore.filters.type
          return (
            <UI.ListItem
              key={type}
              icon={type.icon}
              highlight={highlight}
              highlightBackground={[0, 0, 0, 0.1]}
              glow={!highlight}
              padding={[0, 15]}
              onClick={() => {
                feedStore.setFilter(
                  'type',
                  isUndefined(type.type) ? type.name : type.type
                )
              }}
            >
              {capitalize(type.name)}
            </UI.ListItem>
          )
        })}
      </UI.List>
    )
  }
}

@view
class FeedNavBar {
  render({ feedStore }) {
    return (
      <navbar>
        <UI.Popover
          target={
            <UI.Button
              icon="funnel"
              borderRadius={50}
              marginLeft={-4}
              iconColor="red"
              borderWidth={0}
            >
              <UI.Title>Feed</UI.Title>
            </UI.Button>
          }
        >
          <FeedFilters feedStore={feedStore} />
        </UI.Popover>
      </navbar>
    )
  }
  static style = {
    navbar: {
      flex: 1,
      padding: [0, 25, 0],
      marginTop: 15,
      flexFlow: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      position: 'relative',
    },
  }
}

@view({
  store: class HighlightsStore {
    things = Thing.find()
  },
})
class RepoHighlights {
  render({ store, onSelect }) {
    return (
      <things>
        {(store.things || []).map(thing => (
          <thing onClick={() => onSelect(thing)}>
            <UI.Title size={1.2}>{thing.title}</UI.Title>
          </thing>
        ))}
      </things>
    )
  }

  static style = {
    things: {
      marginTop: 100,
    },
  }
}

@view.attach('homeStore')
@view({
  feedStore: FeedStore,
})
export default class FeedMain extends React.Component<Props> {
  render({ feedStore, homeStore, paneProps, data }: Props) {
    // const { type } = paneProps.data
    // console.log('type is', type)
    return (
      <Pane
        {...paneProps}
        items={[
          () => <FeedHeader feedStore={feedStore} />,
          //() => <FeedRecently />,
          () => (
            <highlights>
              <Calendar
                labels={feedStore.firstNames}
                if={data.type === 'person'}
              />
              <RepoHighlights
                onSelect={thing => {
                  homeStore.stack.navigate(thing)
                }}
              />
            </highlights>
          ),
          () => <FeedNavBar feedStore={feedStore} />,
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
