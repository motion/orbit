import * as React from 'react'
import * as UI from '@mcro/ui'
import { fuzzy } from '~/helpers'

export default class MailSidebar {
  get search() {
    return this.props.oraStore.search
  }

  items = [
    {
      title: 'Confirm your Twitter account, neon',
      subtitle: 'confirm@twitter.com',
      icon: 'mail',
      props: {
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
      category: 'People',
      props: {
        glow: false,
      },
      children: (
        <row
          css={{
            flexFlow: 'row',
            overflowY: 'hidden',
            overflowX: 'scroll',
            maxWidth: 'calc(100% + 20px)',
            margin: [0, -10],
            padding: [0, 10],
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
              onClick={e => {
                e.stopPropagation()
                this.props.navigate({
                  title: name,
                  subtitle: 'mike@mconasda.com',
                  icon: true,
                  type: 'person',
                  id: 1,
                })
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
      props: { iconAfter: false },
    },
    {
      title: 'Some related email goes here',
      subtitle: 'Some related text you can see here',
      icon: 'email',
      date: Date.now() - 100000,
      category: 'Recently',
      props: { iconAfter: false },
    },
    {
      title: 'How do you solve for X when Y is something',
      subtitle: 'Some related text you can see here',
      icon: 'social-slack',
      date: Date.now() - 1000000,
      category: 'Recently',
      props: { iconAfter: false },
    },

    {
      title: 'Suggestions',
      category: 'Follow Up',
      displayTitle: false,
      children: (
        <row
          css={{
            flex: 1,
            overflow: 'hidden',
            flexFlow: 'row',
            justifyContent: 'space-between',
          }}
        >
          {[
            {
              name: 'Jacob Bovee',
              image: 'jacob',
              type: 'Person',
              subtitle: 'jacob@me.com',
            },
            {
              name: 'Engineering',
              subtitle: 'Search',
              image: 'steph',
              type: 'Team',
            },
            {
              name: 'motion/orbit',
              type: 'Issues',
              image: 'nick',
              subtitle: '#frontend',
            },
          ].map(thing => (
            <thing
              css={{
                alignItems: 'center',
                padding: [0, 5],
                flex: 1,
                width: '33.33333%',
              }}
            >
              <UI.Text css={{ marginBottom: 5 }} ellipse size={1} opacity={0.5}>
                {thing.type}
              </UI.Text>
              <img
                css={{
                  width: 40,
                  height: 40,
                  borderRadius: 100,
                  marginBottom: 5,
                  border: [3, [255, 255, 255, 0.1]],
                }}
                src={`/images/${thing.image}.jpg`}
              />
              <UI.Text ellipse size={0.9}>
                {thing.name}
              </UI.Text>
            </thing>
          ))}
        </row>
      ),
    },

    {
      title: 'Actions',
      displayTitle: false,
      children: (
        <div css={{ flex: 1 }}>
          <UI.Row stretch>
            <UI.Button>Create Issue</UI.Button>
            <UI.Button>Add Note</UI.Button>
          </UI.Row>
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
      category: 'Actions',
    },
  ]

  get results() {
    const { contextResults, osContext } = this.props.oraStore
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
    // return [...searchItems, ...this.props.oraStore.context]
  }
}
