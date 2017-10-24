import * as React from 'react'
import * as UI from '@mcro/ui'
import { fuzzy } from '~/helpers'

export default class OraMain {
  get search() {
    return this.props.homeStore.search
  }

  items = [
    {
      title: 'Confirm your Twitter account, neon',
      subtitle: 'confirm@twitter.com',
      icon: 'mail',
      props: {
        iconAfter: false,
        highlight: false,
        primaryProps: {
          size: 1.2,
          fontWeight: 600,
        },
        css: {
          paddingTop: 12,
          paddingBottom: 12,
          borderBottom: [1, 'dotted', [255, 255, 255, 0.1]],
        },
      },
    },
    {
      title: '123',
      displayTitle: false,
      children: (
        <row
          css={{
            flexFlow: 'row',
            overflowX: 'scroll',
            width: '100%',
          }}
        >
          {['Mike McConville', 'Nick Cammarata'].map(name => (
            <minicard
              key={name}
              css={{
                width: '90%',
                borderRadius: 5,
                background: [255, 255, 255, 0.1],
                padding: [8, 10],
                margin: [0, 10, 0, 0],
              }}
            >
              <title
                css={{
                  flexFlow: 'row',
                  marginBottom: 3,
                  alignItems: 'center',
                }}
              >
                <img
                  css={{
                    width: 26,
                    height: 26,
                    borderRadius: 100,
                    border: [3, [255, 255, 255, 0.1]],
                    marginRight: 5,
                  }}
                  src="/images/jacob.jpg"
                />
                <UI.Text size={1.1}>{name}</UI.Text>
              </title>
              <UI.Row stretch itemProps={{ height: 26 }}>
                <UI.Button icon="social-fb" />
                <UI.Button icon="social-linked" />
                <UI.Button icon="social-pr" />
              </UI.Row>
            </minicard>
          ))}
        </row>
      ),
    },
    {
      title: 'Some related email goes here',
      subtitle: 'Some related text you can see here',
      date: Date.now(),
      icon: 'email',
      category: 'Recently',
    },
    {
      title: 'Some related email goes here',
      subtitle: 'Some related text you can see here',
      icon: 'email',
      date: Date.now() - 100000,
      category: 'Recently',
    },
    {
      title: 'How do you solve for X when Y is something',
      subtitle: 'Some related text you can see here',
      icon: 'social-slack',
      date: Date.now() - 1000000,
      category: 'Recently',
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

    // const context =
    //   osContext && osContext.show
    //     ? contextResults
    //     : [
    //         {
    //           type: 'message',
    //           title: 'Load a github issue',
    //         },
    //       ]

    return searchItems
    // return context // searchItems.concat(contextResults)
    // return [...searchItems, ...this.props.homeStore.context]
  }
}
