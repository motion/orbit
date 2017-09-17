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

class BarTeamStore {
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

type Props = PaneProps & { store: BarTeamStore }

@view({
  store: BarTeamStore,
})
export default class BarTeam extends Component<Props> {
  static defaultProps: Props

  render({ store, paneStore }: Props) {
    console.log('render team', store.results)
    const heights = [
      55,
      40,
      280,
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
      <Pane.Card>
        <UI.Drawer
          from="bottom"
          open={store.isOpen}
          onClickOverlay={store.ref('isOpen').toggle}
          showOverlay
          overlayBlur
          css={{ right: 6, left: 6 }}
        >
          <UI.Theme name="light">
            <UI.Surface background="#fff" flex padding={20} borderTopRadius={6}>
              <UI.Title>Have a nice day</UI.Title>
            </UI.Surface>
          </UI.Theme>
        </UI.Drawer>
        <UI.List
          virtualized={{
            rowHeight: getRowHeight,
          }}
          items={[
            () => (
              <section>
                <UI.Title onClick={store.ref('isOpen').toggle} size={2}>
                  Team {paneStore.data.team}
                </UI.Title>
              </section>
            ),
            () => (
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
          getItem={item => item()}
        />
      </Pane.Card>
    )
  }

  static style = {
    section: {
      padding: [8, 10],
      justifyContent: 'center',
    },
  }
}
