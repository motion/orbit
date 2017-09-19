// @flow
import * as React from 'react'
import { view, watch, Component } from '@mcro/black'
import { Event } from '~/app'
import * as UI from '@mcro/ui'
import * as Pane from '~/apps/panes/pane'
import type { PaneProps, PaneResult } from '~/types'
import Calendar from './calendar'
import FeedItem from './views/feedItem'

const eventToPaneResult = (event: Event): PaneResult => ({
  title: event.title,
})

class BarTeamStore {
  props: PaneProps
  isOpen = false
  activeType = 'All'
  types = [
    { name: 'All', icon: false },
    { name: 'Calendar', icon: 'cal' },
    { name: 'Github', icon: 'github' },
    { name: 'Drive', icon: 'hard' },
    { name: 'Jira', icon: 'atl' },
    { name: 'Google Docs', icon: 'google' },
  ]

  setActiveType = type => {
    console.log('setting type to', type.name)
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
}

type Props = PaneProps & { store: BarTeamStore }

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

@view({
  store: BarTeamStore,
})
export default class BarTeam extends Component<Props> {
  render({ store, paneStore }: Props) {
    // return <h4>team page</h4>
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
            view: () => (
              <section>
                <UI.Title onClick={store.ref('isOpen').toggle} size={2}>
                  Team {paneStore.data.team}
                </UI.Title>
              </section>
            ),
          },
          {
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
            view: () => (
              <section>
                <div
                  $$row
                  css={{ alignItems: 'flex-start', maxHeight: '100%' }}
                >
                  <Calendar isSmall={store.activeType === 'Calendar'} />
                </div>
              </section>
            ),
          },
          ...(store.events || []).map(event => ({
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
