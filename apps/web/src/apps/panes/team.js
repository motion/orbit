// @flow
import * as React from 'react'
import { view, watch, Component } from '@mcro/black'
import { Event } from '~/app'
import * as UI from '@mcro/ui'
import type { PaneProps } from '~/types'
import Feed from './views/feed'
import Calendar from './views/calendar'

class BarTeamStore {
  props: PaneProps
  start() {
    this.props.getRef(this)
  }

  @watch events: ?Array<Event> = (() => Event.find({ sort: 'createdAt' }): any)

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
  render({ store, activeIndex, data }: Props) {
    return (
      <UI.Theme name="clear-light">
        <team>
          <section>
            <UI.Title size={2}>Team {data.team}</UI.Title>
          </section>

          <section>
            <Calendar />
          </section>

          <section css={{ flex: 1 }}>
            <Feed items={store.results} data={data} activeIndex={activeIndex} />
          </section>
        </team>
      </UI.Theme>
    )
  }

  static style = {
    team: {
      minWidth: 200,
      padding: [0, 10],
      background: '#fff',
      borderRadius: 4,
      boxShadow: '0 0 4px rgba(0,0,0,0.4)',
      flex: 1,
      margin: [-10, -10, -2, -10],
      overflowY: 'scroll',
      zIndex: 100000000,
      position: 'relative',
    },
    section: {
      padding: [8, 10],
      borderBottom: [1, [0, 0, 0, 0.05]],
    },
  }
}
