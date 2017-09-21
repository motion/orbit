// @flow
import * as React from 'react'
import { view, watch, Component } from '@mcro/black'
import { Event } from '~/app'
import * as UI from '@mcro/ui'
import * as Pane from '~/apps/panes/pane'
import type { PaneProps, PaneResult } from '~/types'
import Calendar from './calendar'
import FeedItem from './views/feedItem'
import { capitalize, isUndefined } from 'lodash'

const eventToPaneResult = (event: Event): PaneResult => ({
  title: event.title,
})

const nameToUser = {
  nate: 'natew',
  me: 'natew',
  nick: 'ncammarata',
  steel: 'steelbrain',
}

class SetStore {
  props: PaneProps
  isOpen = false
  activeType = 'all'
  types = [
    { name: 'all', icon: false },
    { name: 'calendar', icon: 'cal' },
    { name: 'github', icon: 'github' },
    { name: 'docs', icon: 'hard' },
    { name: 'jira', icon: 'atl' },
    { name: 'issues', icon: 'github' },
  ]
  currentAuthor = ''

  start() {
    this.currentAuthor = nameToUser[this.props.paneStore.data.person]

    console.log('in start')

    this.react(
      () => this.props.paneStore.data.service,
      () => {
        const { service } = this.props.paneStore.data
        console.log('service is', service)
        this.activeType = service || 'all'
      },
      true
    )
  }

  setActiveType = type => {
    this.activeType = type.name
  }

  @watch
  events: ?Array<Event> = (() =>
    Event.find({ created: { $ne: null } })
      .sort({ created: 'desc' })
      .limit(20): any)

  get results(): Array<Event> {
    return this.events ? this.events.map(eventToPaneResult) : []
  }

  get calendarActive() {
    return this.activeType === 'calendar'
  }

  get allActive() {
    return this.activeType === 'all'
  }
}

type Props = PaneProps & { store: SetStore }

@view
class Events {
  render({ store }) {
    const active = (store.events || []).filter(event => {
      if (event.author !== store.currentAuthor) return false

      if (store.allActive) return true

      // https://github.com/motion/orbit/issues/67
      if (
        event.integration === 'github' &&
        store.activeType === 'issues' &&
        !isUndefined(event.comments)
      ) {
        return event
      }

      return event.integration === store.activeType
    })
    return (
      <container>
        <events if={active.length > 0}>
          {active.map(event => <FeedItem event={event} />)}
        </events>
        <placeholder if={active.length === 0}>No Event Found</placeholder>
      </container>
    )
  }
}

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
            {capitalize(type.name)}
          </UI.Button>
        ))}
      </UI.Row>
    )
  }
}

@view({
  store: SetStore,
})
export default class SetView extends Component<Props> {
  render({ store, paneStore }: Props) {
    // return <h4>team page</h4>
    if (!store.results.length) {
      return (
        <div $$padded>
          <UI.FakeText lines={5} />
        </div>
      )
    }

    const items = [
      {
        height: 75,
        view: () => (
          <section $$row>
            <img $image src={`/images/${paneStore.data.image}.jpg`} />
            <UI.Title onClick={store.ref('isOpen').toggle} size={2}>
              {paneStore.data.person}
            </UI.Title>
          </section>
        ),
      },
      {
        height: 60,
        view: () => <ItemsSection store={store} />,
      },
      {
        height: 200,
        view: () => (
          <section
            if={store.allActive || store.calendarActive}
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
      {
        height: 500,
        view: () => <Events store={store} />,
      },
    ]

    return (
      <div style={{ flex: 1 }}>
        <Pane.Card
          itemProps={{
            glow: false,
          }}
          items={items}
        />
      </div>
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
      margin: 'auto',
      marginRight: 10,
    },
  }
}
