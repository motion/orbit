// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Pane from '~/apps/pane'
import type { PaneProps } from '~/types'
import Calendar from './calendar'
import FeedItem from './feedItem'
import FeedStore from './feedStore'
import { capitalize, isUndefined } from 'lodash'

type Props = PaneProps & { store: FeedStore }

const SubTitle = props => (
  <UI.Title
    fontWeight={400}
    color={[0, 0, 0, 0.5]}
    marginBottom={10}
    {...props}
  />
)

const Link = props => (
  <UI.Text fontWeight={400} color="darkblue" display="inline" {...props} />
)

@view
class FeedRecently {
  render() {
    const itemProps = {
      padding: [7, 0],
      size: 1.2,
    }

    return (
      <recently $$row>
        <section>
          <SubTitle>Recently</SubTitle>
          <UI.List
            size={1.2}
            itemProps={itemProps}
            items={[
              {
                primary: 'Some Doc',
                icon: '/images/google-docs-icon.svg',
              },
              {
                primary: 'User Research',
                icon: '/images/google-docs-icon.svg',
              },
              { primary: 'motion/orbit', icon: '/images/github-icon.svg' },
              { primary: 'motion/something', icon: '/images/github-icon.svg' },
            ]}
          />
        </section>
        <section>
          <SubTitle>Stats</SubTitle>
          <UI.Card title="Active in: Slack" />
        </section>
      </recently>
    )
  }

  static style = {
    recently: {
      padding: [30, 15],
      flex: 1,
    },
    section: {
      width: '50%',
    },
  }
}

//<UI.Row
//        stretch
//        css={{
//          margin: [0, -10, 10],
//          background: '#eee',
//        }}
//        itemProps={{
//          size: 1,
//          height: 42,
//          borderWidth: 0,
//          highlightBackground: '#fff',
//          highlightColor: '#000',
//        }}
//      >
//        {store.types.map(type => {
//          const highlight =
//            (isUndefined(type.type) ? type.name : type.type) ===
//            store.filters.type
//          return (
//            <UI.Button
//              key={type}
//              icon={type.icon}
//              highlight={highlight}
//              glow={!highlight}
//              padding={[0, 15]}
//              borderRadius={0}
//              opacity={highlight ? 1 : 0.5}
//              css={{
//                borderBottom: [1, 'solid', '#fff'],
//                borderColor: highlight ? 'transparent' : '#eee',
//              }}
//              onClick={() => {
//                store.setFilter(
//                  'type',
//                  isUndefined(type.type) ? type.name : type.type
//                )
//              }}
//            >
//              {capitalize(type.name)}
//            </UI.Button>
//          )
//        })}
//      </UI.Row>

@view
class FeedNavBar {
  render({ store }) {
    return (
      <navbar>
        <SubTitle>History</SubTitle>
        <UI.Button borderRadius={50}>Filter</UI.Button>
      </navbar>
    )
  }
  static style = {
    navbar: {
      flex: 1,
      padding: [0, 15],
      flexFlow: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
  }
}

@view.attach('barStore')
@view({
  store: FeedStore,
})
export default class SetView extends React.Component<Props> {
  render({ store }: Props) {
    // return <h4>team page</h4>
    if (!store.allItems.length) {
      return (
        <div $$padded>
          <UI.FakeText lines={5} />
        </div>
      )
    }

    // CHART
    // false && () => (
    //   <section>
    //     <chart className="chart">
    //       <Chart store={store} />
    //     </chart>
    //   </section>
    // ),

    return (
      <Pane.Card
        theme="light"
        css={{
          borderRadius: 5,
          boxShadow: [[0, 2, 10, [0, 0, 0, 0.15]]],
        }}
        items={[
          () => (
            <section
              $$row
              css={{ padding: [10, 15, 5], alignItems: 'flex-end' }}
            >
              <title
                css={{
                  paddingTop: 30,
                  paddingBottom: 25,
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
                      color="#000"
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
                      <UI.Text>Currently:&nbsp;</UI.Text>
                      <Link>#58 Something With a Long Title</Link>
                    </subtitle>
                  </titles>
                </main>
              </title>

              <cardsFade
                if={false}
                $$fullscreen
                css={{
                  top: '85%',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.04))',
                  //left: '50%',
                }}
              />

              <rightSide
                css={{
                  position: 'relative',
                  height: '100%',
                  lineHeight: '1.2rem',
                  justifyContent: 'flex-end',
                  paddingBottom: 20,
                }}
              >
                <aside css={{ maxHeight: 55 }}>
                  <card
                    css={{
                      flexShrink: 0,
                      textAlign: 'right',
                      flex: 1,
                    }}
                  >
                    <content $$row css={{ alignItems: 'center' }}>
                      <stats
                        css={{
                          padding: [10, 0],
                          opacity: 0.7,
                          lineHeight: '1.4rem',
                        }}
                      >
                        <UI.Text>natewienert@gmail.com</UI.Text>
                        <UI.Text>
                          Team: <Link>Motion</Link>
                        </UI.Text>
                      </stats>
                    </content>
                  </card>
                </aside>
              </rightSide>
            </section>
          ),
          () => <Calendar />,
          //() => (
          //  <UI.Title margin={[15, 0, 0, 15]} color="#000" fontWeight="800">
          //    Recently
          //  </UI.Title>
          //),
          () => <FeedRecently />,
          () => <FeedNavBar store={store} />,
          ...store.activeItems.map(item => () => (
            <FeedItem
              store={store}
              event={item}
              hideName={
                store.filters.people && store.filters.people[0] === 'Me'
              }
            />
          )),
        ]}
      />
    )
  }

  static style = {
    section: {
      flex: 1,
      padding: [0, 15],
    },
    image: {
      width: 30,
      height: 30,
      borderRadius: 1000,
      margin: 'auto',
      marginRight: 10,
    },
  }
}
