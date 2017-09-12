// @flow
import * as React from 'react'
import { view, watch } from '@mcro/black'
import { Event } from '~/app'
import * as UI from '@mcro/ui'
import DocPane from './doc'
import GithubPane from './github'
import type { PaneProps } from '~/types'
import Feed from './views/feed'
import Calendar from './views/calendar'

class BarFeedStore {
  props: PaneProps

  start() {
    this.props.getRef(this)
  }

  get person() {
    return this.props.paneStore.data && this.props.paneStore.data.person
  }

  @watch
  events: ?Array<Event> = (() =>
    Event.find({ author: this.person, updated: { $ne: null } })
      .sort({
        updated: 'desc',
      })
      .limit(20): any)

  get results(): Array<Event> {
    return this.events || []
  }
}

type Props = PaneProps & {| store: BarFeedStore |}

@view({
  store: BarFeedStore,
})
export default class BarFeed extends React.Component<Props> {
  static defaultProps: Props
  render({ store, paneStore }: Props) {
    const { data } = paneStore

    const content = (
      <contents>
        <section>
          <UI.Title size={2}>{data.person}</UI.Title>
        </section>

        <section $$row>
          <UI.Title>Now</UI.Title>{' '}
          <subtitle $$row $$centered>
            <UI.Badge background="rgb(34.5%, 64.6%, 67.5%)" marginRight={8}>
              #52
            </UI.Badge>{' '}
            <UI.Text size={1.05}>
              Kubernetes integration with new cloud setup
            </UI.Text>
          </subtitle>
        </section>

        <section>
          <Calendar />
        </section>

        <section>
          <Feed
            items={store.results}
            data={data}
            activeIndex={paneStore.activeIndex}
          />
        </section>
      </contents>
    )

    if (!data.special) {
      return <feed>{content}</feed>
    }

    return (
      <feed>
        <apps if={data.special} css={{ borderBottom: [2, [0, 0, 0, 0.0001]] }}>
          <UI.TabPane
            tabs={[
              <tab>
                <UI.Badge background="rgb(34.5%, 67.5%, 34.5%)" marginRight={8}>
                  #301
                </UI.Badge>
                <UI.Text ellipse>Product Page Something Or Other</UI.Text>
              </tab>,
              <tab>
                <UI.Badge
                  background="rgb(34.5%, 64.6%, 67.5%)"
                  color="white"
                  marginRight={8}
                >
                  #52
                </UI.Badge>
                <UI.Text ellipse>Kubernetes React Integration Thingie</UI.Text>
              </tab>,
            ]}
          >
            <DocPane
              data={{
                title: 'Product Page Integration',
                id: '301',
                author: 'Nate',
              }}
            />
            <GithubPane
              data={{
                title: 'Kubernetes React Integration',
                id: '52',
                author: 'Steph',
              }}
            />
          </UI.TabPane>
        </apps>

        {content}
      </feed>
    )
  }

  static style = {
    feed: {
      flex: 1,
      minWidth: 200,
      padding: [0, 10],
    },
    tab: {
      flexFlow: 'row',
      overflow: 'hidden',
      maxWidth: '100%',
    },
    span: {
      marginRight: 4,
    },
    section: {
      padding: [8, 10],
      borderBottom: [1, [0, 0, 0, 0.05]],
    },
  }
}
