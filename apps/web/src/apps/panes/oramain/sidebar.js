import * as React from 'react'
import * as UI from '@mcro/ui'
import { watch } from '@mcro/black'
import { fuzzy } from '~/helpers'
import Calendar from '../feed/calendar'
import FeedItem from '../feed/feedItem'
import { Event, Thing } from '~/app'

export default class OraMain {
  get search() {
    return this.props.homeStore.search
  }

  @watch
  things = () =>
    Thing.find()
      .sort({ updated: 'desc' })
      .limit(20)

  @watch
  events = () =>
    Event.find()
      .where('created')
      .ne(null)
      .lte(new Date().toISOString())
      .sort({ created: 'desc' })
      .limit(100)

  // {[
  //   {
  //     name: 'Kubernetes deploy docs',
  //     image: 'jacob',
  //     date: Date.now() - 1000000,
  //     type: 'github',
  //     subtitle: 'jacob@me.com',
  //   },
  //   {
  //     name: 'Engineering',
  //     subtitle: 'Search',
  //     date: Date.now() - 10000000,
  //     image: 'steph',
  //     type: 'google',
  //   },
  //   {
  //     name: 'motion/orbit',
  //     type: 'slack',
  //     date: Date.now() - 100000000,
  //     image: 'nick',
  //     subtitle: '#frontend',
  //   },
  //   {
  //     name: 'motion/orbit',
  //     type: 'github',
  //     date: Date.now() - 1000000000,
  //     image: 'nick',
  //     subtitle: '#frontend',
  //   },
  //   {
  //     name: 'motion/orbit',
  //     type: 'google',
  //     date: Date.now() - 10000000000,
  //     image: 'nick',
  //     subtitle: '#frontend',
  //   },
  // ]}

  NAME_MAP = {
    ncammarata: 'nick',
    natew: 'me',
  }

  get items() {
    return [
      {
        category: 'My Recent',
        title: 'my recent',
        displayTitle: false,
        props: {
          highlight: false,
          glow: false,
        },
        children: (
          <row
            css={{
              flex: 1,
              padding: [10, 10],
              margin: [0, -10],
              overflow: 'hidden',
              overflowX: 'scroll',
              flexFlow: 'row',
              justifyContent: 'space-between',
            }}
          >
            {(this.things || []).map(thing => (
              <thing
                onClick={e => {
                  e.stopPropagation()
                  this.props.navigate(Thing.toResult(thing))
                }}
                css={{
                  alignItems: 'center',
                  padding: [0, 5],
                  flex: 1,
                  width: '29%',
                }}
              >
                <iconarea
                  css={{
                    position: 'relative',
                  }}
                >
                  <img
                    css={{
                      width: 40,
                      height: 40,
                      borderRadius: 100,
                      marginBottom: 5,
                      border: [3, [255, 255, 255, 0.1]],
                    }}
                    src={`/images/${this.NAME_MAP[thing.author] ||
                      'steph'}.jpg`}
                  />
                  <UI.Icon
                    size={20}
                    opacity={0.8}
                    name={`social-${thing.integration}`}
                    css={{
                      position: 'absolute',
                      bottom: 0,
                      right: -5,
                    }}
                  />
                </iconarea>
                <UI.Text ellipse size={0.9}>
                  {thing.title}
                </UI.Text>
                <UI.Date ellipse size={0.8} opacity={0.6}>
                  {thing.updated}
                </UI.Date>
              </thing>
            ))}
          </row>
        ),
      },

      {
        category: 'Upcoming',
        title: 'none',
        displayTitle: false,
        children: (
          <calwrap
            css={{
              border: [1, [255, 255, 255, 0.1]],
              borderRight: 'none',
              borderLeft: 'none',
            }}
          >
            <Calendar labels={[]} />
          </calwrap>
        ),
      },
    ]
  }

  get results() {
    const items = [
      ...this.items,
      ...(this.events || []).map((item, index) => ({
        children: () => <FeedItem inline event={item} index={index} />,
      })),
    ]

    if (!this.search) {
      return items
    }

    const search = fuzzy(this.items, this.search)
    const searchItems = search.length
      ? search
      : [
          {
            type: 'message',
            title: 'No Results...',
            data: { message: 'No results' },
            category: 'Search Results',
          },
        ]

    return searchItems
  }
}
