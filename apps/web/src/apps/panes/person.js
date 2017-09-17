// @flow
import * as React from 'react'
import { view, watch, Component } from '@mcro/black'
import { Event } from '~/app'
import * as UI from '@mcro/ui'
import * as Pane from '~/apps/panes/pane'
import type { PaneProps, PaneResult } from '~/types'
import Calendar from './views/calendar'
import FeedItem from './views/feedItem'

const eventToPaneResult = (event: Event): PaneResult => ({
  title: event.title,
})

class BarPersonStore {
  props: PaneProps

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

@view({
  store: BarPersonStore,
})
export default class BarPerson extends Component<Props> {
  static defaultProps: Props

  render({ store, paneStore }: Props) {
    const heights = [
      90,
      55,
      260,
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

    return (
      <Pane.Card
        css={{
          transition: 'all ease-in 80ms',
          zIndex: 1000,
          transform: { y: paneStore.isActive ? -15 : 0 },
        }}
      >
        <UI.List
          getRef={paneStore.setList}
          virtualized={{
            rowHeight: getRowHeight,
          }}
          itemProps={{
            ...paneStore.itemProps,
            glow: false,
          }}
          items={[
            () => (
              <section $$row>
                <img $image src={`/images/${paneStore.data.image}.jpg`} />
                <UI.Title onClick={store.ref('isOpen').toggle} size={2}>
                  {paneStore.data.person}
                </UI.Title>
              </section>
            ),
            () => (
              <section>
                <UI.Row
                  spaced
                  itemProps={{ size: 1, borderWidth: 0, glint: false }}
                  css={{ justifyContent: 'flex-end' }}
                >
                  <UI.Button highlight>All</UI.Button>
                  <UI.Button icon="cal">Calendar</UI.Button>
                  <UI.Button icon="github">Github</UI.Button>
                  <UI.Button icon="hard">Drive</UI.Button>
                  <UI.Button icon="atl">Jira</UI.Button>
                  <UI.Button icon="google">Google Docs</UI.Button>
                </UI.Row>
              </section>
            ),
            () => (
              <section>
                <UI.Title opacity={1} marginBottom={10}>
                  Tuesday, the 12th
                </UI.Title>
                <Calendar />
                <Calendar />
              </section>
            ),
            ...(store.events || [])
              .map(event => () => <FeedItem event={event} key={event.id} />),
          ]}
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
      margin: 'auto',
      marginRight: 10,
    },
  }
}
