// @flow
import React from 'react'
import { view, watch } from '@mcro/black'
import { Event } from '~/app'
import * as UI from '@mcro/ui'
import DocPane from './doc'
import GithubPane from './github'
import type { PaneProps } from '~/types'

class BarFeedStore {
  props: PaneProps

  start() {
    this.props.getRef(this)
  }

  @watch
  // $FlowFixMe
  events: ?Array<Event> = () =>
    Event.find({ author: this.props.data.person, sort: { createdAt: 'asc' } })

  get results(): Array<Event> {
    return this.events || []
  }
}

@view({
  store: BarFeedStore,
})
export default class BarFeed {
  render({ store, activeIndex, data }: PaneProps & { store: BarFeedStore }) {
    const results = store.results.map((event, index) => {
      const { type, data } = event
      const { actor, payload } = data

      return (
        <feeditem $active={activeIndex === index} key={`${event.id}${index}`}>
          <meta if={actor}>
            <avatar $img={actor.avatar_url} />
            <UI.Text $name>
              {actor.login}{' '}
            </UI.Text>
            <UI.Text $action>
              {type}{' '}
            </UI.Text>
            <UI.Text $date>
              {data.created_at}{' '}
            </UI.Text>
          </meta>
          <body if={payload && payload.commits}>
            <content>
              {payload.commits.map(commit =>
                <UI.Text key={commit.sha}>
                  {commit.message}
                </UI.Text>
              )}
            </content>
            <icon>
              <UI.Icon name={event.integration} />
            </icon>
          </body>
        </feeditem>
      )
    })

    const content = (
      <contents>
        <section>
          <UI.Title size={2}>
            {data.person}
          </UI.Title>
        </section>

        <section $$row>
          <UI.Title>Now</UI.Title>{' '}
          <subtitle $$row $$centered>
            <UI.Badge
              background="rgb(34.5%, 64.6%, 67.5%)"
              color="white"
              marginRight={8}
            >
              #52
            </UI.Badge>{' '}
            <UI.Text color="#fff" size={1.05}>
              Kubernetes integration with new cloud setup
            </UI.Text>
          </subtitle>
        </section>

        <section $personal>
          <UI.Title>Calender</UI.Title>
          <content
            $$row
            css={{ width: '100%', overflowX: 'scroll', margin: [-5, 0] }}
          >
            {[
              {
                month: '12',
                day: '7',
                time: '7am',
                description: 'IdeaDrive w/Search team',
              },
              {
                month: '12',
                day: '7',
                time: '10am',
                description: 'OKR Review w/James',
              },
              {
                month: '12',
                day: '7',
                time: '3pm',
                description: 'Planetary fundraiser',
              },
              {
                month: '12',
                day: '8',
                time: '8am',
                description: 'Q4 linkup review',
              },
              {
                month: '12',
                day: '8',
                time: '10:30am',
                description: '1on1 with Dave',
              },
            ].map(
              (item, index) =>
                item.content ||
                <item
                  if={!item.content}
                  key={index}
                  css={{
                    width: '16.6666%',
                    minWidth: 110,
                    padding: [10, 25, 10, 0],
                    color: '#fff',
                  }}
                >
                  <date
                    css={{
                      opacity: 1,
                      flexFlow: 'row',
                    }}
                  >
                    <time
                      css={{
                        fontSize: 16,
                        opacity: 0.5,
                        fontWeight: 300,
                        marginLeft: 0,
                      }}
                    >
                      {item.time}
                    </time>
                  </date>
                  <description
                    css={{
                      fontSize: 14,
                      lineHeight: '17px',
                      marginTop: 10,
                      fontWeight: 400,
                    }}
                  >
                    {item.description}
                  </description>
                </item>
            )}
          </content>
        </section>

        <section $feeditems $inApp={data.special}>
          <UI.Title>Recently</UI.Title>
          <unpad>
            {results}
          </unpad>
        </section>
      </contents>
    )

    if (!data.special) {
      return (
        <feed>
          {content}
        </feed>
      )
    }

    return (
      <UI.Theme name="light">
        <feed>
          <apps
            if={data.special}
            css={{ borderBottom: [2, [0, 0, 0, 0.0001]] }}
          >
            <UI.TabPane
              tabs={[
                <tab>
                  <UI.Badge
                    background="rgb(34.5%, 67.5%, 34.5%)"
                    color="white"
                    marginRight={8}
                  >
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
                  <UI.Text ellipse>
                    Kubernetes React Integration Thingie
                  </UI.Text>
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
      </UI.Theme>
    )
  }

  static style = {
    feed: {
      flex: 1,
      minWidth: 200,
      padding: [0, 10],
      overflowY: 'scroll',
    },
    unpad: {
      margin: [0, -15],
    },
    tab: {
      flexFlow: 'row',
      overflow: 'hidden',
      maxWidth: '100%',
    },
    feeditem: {
      padding: [10, 25],
      margin: [0, -5],
      color: '#fff',
      borderBottom: [1, [0, 0, 0, 0.05]],
    },
    meta: {
      flexFlow: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      whiteSpace: 'pre',
      fontSize: 13,
      marginBottom: 5,
    },
    name: {
      fontWeight: 500,
    },
    action: {
      opacity: 0.5,
    },
    date: {
      opacity: 0.5,
    },
    body: {
      flexFlow: 'row',
    },
    inApp: {
      padding: [10, 15],
      background: '#f2f2f2',
    },
    content: {
      flex: 1,
      padding: [2, 5],
    },
    icon: {
      width: 30,
      height: 30,
      margin: [10, 5, 0],
      position: 'relative',
    },
    section: {
      padding: [8, 10],
      borderBottom: [1, [0, 0, 0, 0.05]],
    },
    span: {
      marginRight: 4,
    },
    avatar: {
      width: 18,
      height: 18,
      borderRadius: 100,
      marginRight: 8,
    },
    img: src => ({
      background: `url(${src})`,
      backgroundSize: 'cover',
    }),
    active: {
      background: [0, 0, 0, 0.05],
    },
  }
}
