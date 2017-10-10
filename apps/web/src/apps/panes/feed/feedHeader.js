// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Link } from '~/views'

@view
export default class FeedHeader {
  render({ feedStore }) {
    const NAME_TO_AVATAR = {
      'Nate Wienert': 'me',
      'Carol Hienz': 'jacob',
      'Jacob Bovee': 'jacob',
      Steel: 'steel',
      'Nick Cammarata': 'nick',
    }
    const bg = name => `url(/images/${NAME_TO_AVATAR[name]}.jpg)`
    const avatars = feedStore.filters.people.slice(0, 2)

    return (
      <UI.Theme name="light">
        <section>
          <content>
            <title
              css={{
                flex: 1,
                justifyContent: 'flex-end',
              }}
            >
              <main css={{ flexFlow: 'row', alignItems: 'flex-end' }}>
                {avatars.map((name, index) => (
                  <avatar
                    key={index}
                    css={{
                      alignSelf: 'center',
                      width: 42,
                      height: 42,
                      marginRight: index === avatars.length - 1 ? 18 : -35,
                      borderRadius: 12,
                      transform: {
                        rotate: {
                          0: '-15deg',
                          1: '0deg',
                          2: '15deg',
                        }[index],
                      },
                      backgroundImage: bg(name),
                      backgroundSize: 'cover',
                    }}
                  />
                ))}
                <titles css={{ flex: 1 }}>
                  <UI.Title
                    onClick={feedStore.ref('isOpen').toggle}
                    size={2}
                    fontWeight={800}
                    marginBottom={5}
                  >
                    {feedStore.filters.people[0] === 'Me'
                      ? 'Nate Wienert'
                      : feedStore.filters.people
                          .map(x => x.replace(/ .*/, ''))
                          .join(', ')}
                  </UI.Title>
                  <subtitle
                    $$row
                    css={{
                      flex: 1,
                      alignItems: 'center',
                      fontSize: 16,
                      opacity: 0.7,
                    }}
                  >
                    <UI.Text size={1.1} opacity={0.8}>
                      Now:&nbsp;
                    </UI.Text>
                    <UI.Button
                      inline
                      chromeless
                      borderRadius={50}
                      size={1.2}
                      marginBottom={-5}
                    >
                      #58 Something With a Long Title
                    </UI.Button>
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
      borderBottom: [1, [0, 0, 0, 0.08]],
      padding: [8, 15, 20],
      position: 'relative',
      flex: 1,
    },
    content: {
      padding: [20, 0, 5],
      alignItems: 'flex-end',
      flexFlow: 'row',
    },
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
    aside: {
      maxHeight: 55,
    },
    asideContent: {
      alignItems: 'center',
      padding: [0, 15],
    },
  }
}
