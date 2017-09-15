// @flow
import * as React from 'react'
import { view, watch, Component } from '@mcro/black'
import { Event } from '~/app'
import * as UI from '@mcro/ui'
import type { PaneProps } from '~/types'
import Calendar from './views/calendar'
import FeedItem from './views/feedItem'

class BarTeamStore {
  props: PaneProps
  start() {
    this.props.getRef(this)
  }

  @watch
  events: ?Array<Event> = (() =>
    Event.find({ created: { $ne: null } })
      .sort({ created: 'desc' })
      .limit(50): any)

  get results(): Array<Event> {
    return this.events || []
  }
}

type Props = PaneProps & { store: BarTeamStore }

@view({
  store: BarTeamStore,
})
export default class BarTeam extends Component<Props> {
  static defaultProps: Props

  render({ store, paneStore }: Props) {
    if (!store.results.length) {
      return null
    }

    const heights = [55, 40, 230, ...store.events.map(event => event.height)]
    const getRowHeight = index => heights[index] || 100

    return (
      <team>
        <UI.List
          virtualized={{
            rowHeight: getRowHeight,
          }}
          items={[
            <section>
              <UI.Title size={2}>Team {paneStore.data.team}</UI.Title>
            </section>,
            <section>
              <UI.Row
                spaced
                itemProps={{ size: 1 }}
                css={{ justifyContent: 'flex-end' }}
              >
                <UI.Button icon="Github">Github</UI.Button>
                <UI.Button icon="hard">Drive</UI.Button>
                <UI.Button icon="Google">Google Docs</UI.Button>
                <UI.Button icon="Cal">Events</UI.Button>
              </UI.Row>
            </section>,
            <section>
              <UI.Title opacity={1} marginBottom={10}>
                Tuesday, the 12th
              </UI.Title>
              <Calendar />
              <Calendar />
            </section>,
            ...store.events.map(event => (
              <FeedItem event={event} key={event.id} />
            )),
          ]}
          getItem={item => ({
            children: item,
          })}
        />
      </team>
    )
  }

  static style = {
    team: {
      padding: [5, 15],
      flex: 1,
      position: 'relative',
    },
    section: {
      padding: [8, 10],
      justifyContent: 'center',
    },
  }
}
