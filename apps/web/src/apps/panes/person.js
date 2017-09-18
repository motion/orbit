// @flow
import * as React from 'react'
import { view, watch, Component } from '@mcro/black'
import { Event } from '~/app'
import * as UI from '@mcro/ui'
import * as Pane from '~/apps/panes/pane'
import type { PaneProps, PaneResult } from '~/types'
import FeedItem from './views/feedItem'
import Calendar from './calendar'
import { isFunction } from 'lodash'

const eventToPaneResult = (event: Event): PaneResult => ({
  title: event.title,
})

class BarPersonStore {
  props: PaneProps

  activeType = 'All'

  setActiveType = type => {
    console.log('setting type to', type.name)
    this.activeType = type.name
  }
  types = [
    { name: 'All', icon: false },
    { name: 'Calendar', icon: 'cal' },
    { name: 'Github', icon: 'github' },
    { name: 'Drive', icon: 'hard' },
    { name: 'Jira', icon: 'atl' },
    { name: 'Google Docs', icon: 'google' },
  ]

  start() {
    this.props.getRef(this)
  }

  isOpen = false

  @watch
  events: ?Array<Event> = (() =>
    Event.find({ created: { $ne: null } })
      .sort({ created: 'desc' })
      .limit(20): any)

  get results(): Array<Event> {
    return this.events ? this.events.map(eventToPaneResult) : []
  }
}

type Props = PaneProps & { store: BarPersonStore }

@view
class ItemsSection {
  render({ store }) {
    return (
      <UI.Row
        spaced
        itemProps={{ size: 1, borderWidth: 0, glint: false }}
        // css={{ justifyContent: 'flex-end' }}
      >
        {store.types.map(type => (
          <UI.Button
            icon={type.icon}
            highlight={type.name === store.activeType}
            onClick={() => {
              store.setActiveType(type)
            }}
          >
            {type.name}
          </UI.Button>
        ))}
      </UI.Row>
    )
  }
}

@view
class CalSection {
  render({ store }) {
    return (
      <div
        $$row
        $active={store.activeType === 'Calendar'}
        css={{ alignItems: 'center', maxHeight: '100%' }}
      >
        <Calendar isSmall={store.activeType !== 'Calendar'} />
      </div>
    )
  }

  static style = {
    div: {
      transition: 'all ease-in 150ms',
      background: 'rgba(0,0,0,.2)',
      marginLeft: -10,
      paddingLeft: 10,
      width: '110%',
      paddingTop: 20,
      paddingBottom: 20,
    },
    active: {
      marginTop: 100,
    },
  }
}

@view({
  store: BarPersonStore,
})
export default class BarPerson extends Component<Props> {
  static defaultProps: Props

  render({ store, paneStore }: Props) {
    const heights = [
      90,
      55,
      store.activeType === 'Calendar' ? 350 : 200,
      35,
      ...(store.events || []).map(event => event.height),
    ]

    const getRowHeight = index => heights[index] || 100

    if (!store.results.length) {
      return (
        <div $$padded>
          <UI.FakeText lines={5} />
        </div>
      )
    }

    const items = [
      //() => (
      <section $$row>
        <img $image src={`/images/${paneStore.data.image}.jpg`} />
        <UI.Title onClick={store.ref('isOpen').toggle} size={2}>
          {paneStore.data.person}
        </UI.Title>
      </section>,
      //),
      () => (
        <section>
          <ItemsSection store={store} />
        </section>
      ),
      () => (
        <section>
          <CalSection store={store} />
        </section>
      ),
      () => (
        <section>
          <UI.Title opacity={0.5}>Recently</UI.Title>
        </section>
      ),
      ...(store.events || [])
        .slice(0, 2)
        .map(event => () => <FeedItem event={event} key={event.id} />),
    ]
    const activeItems =
      store.activeType === 'Calendar' ? items.slice(0, 3) : items

    return (
      <Pane.Card
        css={{
          transition: 'all ease-in 80ms',
          zIndex: 1000,
          transform: { y: paneStore.isActive ? -15 : 0 },
        }}
      >
        <items>
          {activeItems.map(item => (isFunction(item) ? item() : item))}
        </items>

        <UI.List
          getRef={paneStore.setList}
          if={false}
          virtualized={{
            rowHeight: getRowHeight,
          }}
          itemProps={{
            ...paneStore.itemProps,
            glow: false,
          }}
          items={items}
          getItem={(item, index) => ({
            highlight: () => index === paneStore.activeIndex + 1,
            children: item(),
          })}
        />
      </Pane.Card>
    )
  }

  static style = {
    section: {
      padding: [8, 10],
      justifyContent: 'center',
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 1000,
      // margin: 'auto',
      margin: 0,
      marginRight: 10,
    },
  }
}
