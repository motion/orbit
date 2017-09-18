// @flow
import * as React from 'react'
import { view, watch, Component } from '@mcro/black'
import { Event } from '~/app'
import * as UI from '@mcro/ui'
import * as Pane from '~/apps/panes/pane'
import type { PaneProps, PaneResult } from '~/types'
import Calendar from './views/calendar'
import Calendar2 from './calendar'
import FeedItem from './views/feedItem'

const eventToPaneResult = (event: Event): PaneResult => ({
  title: event.title,
})

class BarTeamStore {
  props: PaneProps
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

type Props = PaneProps & { store: BarTeamStore }

@view({
  store: BarTeamStore,
})
export default class BarTeam extends Component<Props> {
  render({ store, paneStore }: Props) {
    if (!store.results.length) {
      return (
        <div $$padded>
          <UI.FakeText lines={5} />
        </div>
      )
    }

    return (
      <Pane.Card
        itemProps={{
          glow: false,
        }}
        items={[
          {
            height: 65,
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
            view: () => (
              <section>
                <UI.Row
                  spaced
                  itemProps={{ size: 1, borderWidth: 0, glint: false }}
                  css={{ justifyContent: 'flex-end' }}
                >
                  <UI.Button highlight>All</UI.Button>
                  <UI.Button icon="Cal">Calendar</UI.Button>
                  <UI.Button icon="Github">Github</UI.Button>
                  <UI.Button icon="hard">Drive</UI.Button>
                  <UI.Button icon="Google">Google Docs</UI.Button>
                </UI.Row>
              </section>
            ),
          },
          {
            height: 200,
            view: () => (
              <section>
                <div
                  $$row
                  css={{ alignItems: 'flex-start', maxHeight: '100%' }}
                >
                  <cal1 css={{ padding: [0, 10] }}>
                    <Calendar2 />
                  </cal1>
                  <cal2
                    css={{
                      borderLeft: [1, [0, 0, 0, 0.1]],
                      padding: [0, 0, 0, 10],
                      margin: [0, 0, 0, 10],
                    }}
                  >
                    <Calendar />
                  </cal2>
                </div>
              </section>
            ),
          },
          ...(store.events || []).map(event => ({
            height: event.height,
            view: () => <FeedItem event={event} />,
          })),
        ]}
      />
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
