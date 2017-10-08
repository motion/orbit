// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Link } from '~/views'

@view
export default class FeedHeader {
  render({ store }) {
    return (
      <UI.Theme name="light">
        <section>
          <topbar
            $$row
            css={{
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: [6, 0, 0],
              marginRight: -8,
            }}
          >
            <left />
            <right $$row $$centered>
              <UI.Input
                borderRadius={50}
                marginRight={10}
                height={28}
                width={200}
              />
              <UI.Button
                size={0.9}
                circular
                icon="fullscreen71"
                borderWidth={0}
              />
            </right>
          </topbar>

          <content>
            <title
              css={{
                flex: 1,
                justifyContent: 'flex-end',
              }}
            >
              <main css={{ flexFlow: 'row', alignItems: 'flex-end' }}>
                <avatar
                  css={{
                    width: 50,
                    height: 50,
                    marginRight: 15,
                    borderRadius: 1000,
                    background: 'url(/images/me.jpg)',
                    backgroundSize: 'cover',
                  }}
                />
                <titles css={{ flex: 1 }}>
                  <UI.Title
                    onClick={store.ref('isOpen').toggle}
                    size={1.8}
                    fontWeight={800}
                    marginBottom={1}
                  >
                    {store.filters.people[0] === 'Me'
                      ? 'Nate Wienert'
                      : store.filters.people.join(', ')}
                  </UI.Title>
                  <subtitle
                    $$row
                    css={{
                      flex: 1,
                      alignItems: 'center',
                      fontSize: 16,
                      opacity: 0.7,
                      marginBottom: 2,
                    }}
                  >
                    <UI.Text>Now:&nbsp;</UI.Text>
                    <Link>#58 Something With a Long Title</Link>
                  </subtitle>
                </titles>
              </main>
            </title>

            <rightSide>
              <aside>
                <card>
                  <asideContent>
                    <stats>
                      <UI.Text>natewienert@gmail.com</UI.Text>
                      <UI.Text>
                        Team: <Link>Motion</Link>
                      </UI.Text>
                    </stats>
                  </asideContent>
                </card>
              </aside>
            </rightSide>
          </content>
        </section>
      </UI.Theme>
    )
  }

  static style = {
    section: {
      background: '#fff',
      borderBottom: [1, '#eee'],
      padding: [0, 15, 10],
      position: 'relative',
      flex: 1,
    },
    content: { padding: [10, 0, 5], alignItems: 'flex-end', flexFlow: 'row' },
    rightSide: {
      position: 'relative',
      height: '100%',
      lineHeight: '1.2rem',
      justifyContent: 'flex-end',
    },
    stats: {
      padding: [10, 0],
      opacity: 0.7,
      lineHeight: '1.4rem',
    },
    card: {
      flexShrink: 0,
      textAlign: 'right',
      flex: 1,
    },
    aside: { maxHeight: 55 },
    asideContent: { alignItems: 'center', padding: [0, 15] },
  }
}
