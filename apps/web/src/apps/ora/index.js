import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import OraStore from './oraStore'
import Sidebar from '../home/sidebar'
import { fuzzy } from '~/helpers'

const sidebars = {
  oramain: class OraMain {
    get search() {
      return this.props.homeStore.search
    }

    items = [
      {
        title: (
          <UI.Title size={1.2}>Confirm your Twitter account, neon</UI.Title>
        ),
        subtitle: 'confirm@twitter.com',
        icon: 'mail',
        props: {
          style: {
            paddingTop: 12,
            paddingBottom: 12,
          },
        },
      },
      {
        title: (
          <row css={{ flexFlow: 'row' }}>
            <img
              css={{ width: 20, height: 20, borderRadius: 100, marginRight: 5 }}
              src="/images/jacob.jpg"
            />
            Jacob Bovee
          </row>
        ),
        category: 'People',
      },
      {
        title: '12',
        displayTitle: false,
        children: (
          <UI.Row stretch>
            <UI.Button icon="social-fb" />
            <UI.Button icon="social-linked" />
            <UI.Button icon="social-pr" />
          </UI.Row>
        ),
      },
      {
        title: 'Some related email goes here',
        subtitle: 'Some related text you can see here',
        icon: 'email',
        category: 'Related Emails',
      },
      {
        title: 'Some related email goes here',
        subtitle: 'Some related text you can see here',
        icon: 'email',
        category: 'Related Emails',
      },

      {
        title: 'How do you solve for X when Y is something',
        subtitle: 'Some related text you can see here',
        icon: 'social-slack',
        category: 'Conversations',
      },

      {
        title: (
          <div>
            <UI.Button>Add Note</UI.Button>
            {false && (
              <textarea
                css={{
                  background: 'transparent',
                  border: [1, [255, 255, 255, 0.1]],
                  borderRadius: 3,
                  width: '100%',
                  margin: 0,
                  height: 50,
                }}
              />
            )}
          </div>
        ),
        category: 'Notes',
      },
    ]

    get results() {
      const { contextResults, osContext } = this.props.homeStore
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

      const context =
        osContext && osContext.show
          ? contextResults
          : [
              {
                type: 'message',
                title: 'Load a github issue',
              },
            ]

      return context // searchItems.concat(contextResults)
      // return [...searchItems, ...this.props.homeStore.context]
    }
  },
}

const inputStyle = {
  fontWeight: 300,
  color: '#fff',
  fontSize: 20,
}

@view.provide({
  homeStore: OraStore,
})
@view
export default class HomePage {
  render({ homeStore }) {
    return (
      <UI.Theme name="clear-dark">
        <home ref={homeStore.ref('barRef').set} $$fullscreen $$draggable>
          <header $$draggable>
            <UI.Icon
              $searchIcon
              size={16}
              name="zoom"
              color={[255, 255, 255, 1]}
            />
            <UI.Input
              $searchInput
              onClick={homeStore.onClickInput}
              size={1}
              getRef={homeStore.onInputRef}
              borderRadius={0}
              onChange={homeStore.onSearchChange}
              value={homeStore.textboxVal}
              borderWidth={0}
              fontWeight={200}
              css={inputStyle}
            />

            <buttons
              css={{
                position: 'absolute',
                top: 0,
                right: 10,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.5,
              }}
            >
              <UI.Icon size={12} name="remove" color={[255, 255, 255, 1]} />
            </buttons>
          </header>
          <content>
            <Sidebar
              sidebars={sidebars}
              homeStore={homeStore}
              itemProps={{
                size: 1,
                padding: [6, 10],
                glow: true,
                highlightBackground: [255, 255, 255, 0.08],
              }}
            />
          </content>
        </home>
      </UI.Theme>
    )
  }

  static style = {
    home: {
      background: [30, 30, 30, 0.98],
      boxShadow: [[0, 0, 10, [0, 0, 0, 0.4]]],
      margin: 10,
      borderRadius: 10,
      overflow: 'hidden',
    },
    content: {
      flex: 1,
      position: 'relative',
    },
    header: {
      position: 'relative',
      opacity: 0.3,
    },
    searchIcon: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      alignItems: 'center',
      height: 'auto',
      left: 12,
    },
    searchInput: {
      position: 'relative',
      padding: [10, 25],
      paddingLeft: 36,
      borderBottom: [1, 'dotted', [255, 255, 255, 0.1]],
    },
  }
}
