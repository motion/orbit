import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import OraStore from './oraStore'
import Sidebar from '../home/sidebar'
import { OS, fuzzy } from '~/helpers'

const sidebars = {
  oramain: class OraMain {
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
            {['Jacob Bovee', 'Nick Cammarata'].map(name => (
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
                  <UI.Text size={1.1}>Jacob Bovee</UI.Text>
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
        category: 'People',
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
      const search = fuzzy(this.items, this.search)
      if (!search.length) {
        return [
          {
            type: 'message',
            title: 'No Results...',
            data: { message: 'No results' },
            category: 'Search Results',
          },
        ]
      }
      return search
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
    const { focused } = homeStore
    return (
      <UI.Theme name="clear-dark">
        <home
          $visible={!homeStore.hidden}
          ref={homeStore.ref('barRef').set}
          $$fullscreen
          $$draggable
        >
          <header
            $focus={focused}
            onFocus={homeStore.ref('focused').setter(true)}
            onBlur={homeStore.ref('focused').setter(false)}
            $$draggable
          >
            <UI.Icon
              $searchIcon
              size={12}
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
              <UI.Icon
                onClick={homeStore.hide}
                size={12}
                name="remove"
                color={[255, 255, 255, 1]}
              />
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
    header: {
      position: 'relative',
      opacity: 0.3,
      transform: 'scaleY(0.75)',
      margin: [-5, 0],
      transition: 'all ease-in 80ms',
      '& .icon': {
        transition: 'all ease-in 80ms',
        transform: 'scaleX(0.75)',
      },
      '& > .input': {
        transition: 'all ease-in 80ms',
        transform: 'scaleX(0.75)',
      },
      '&:hover': {
        background: [255, 255, 255, 0.05],
      },
    },
    focus: {
      margin: 0,
      opacity: 1,
      transform: 'scaleX(1)',
      '& .icon': {
        transform: 'scaleX(1)',
      },
      '& > .input': {
        transform: 'scaleX(1)',
      },
    },
    home: {
      background: [20, 20, 20, 0.98],
      boxShadow: [[0, 0, 10, [0, 0, 0, 0.4]]],
      margin: 10,
      borderRadius: 10,
      overflow: 'hidden',
      transition: 'all ease-in 100ms',
      opacity: 0,
      transform: {
        x: 20,
      },
    },
    visible: {
      opacity: 1,
      transform: {
        x: 0,
      },
    },
    content: {
      flex: 1,
      position: 'relative',
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
      padding: [8, 25],
      paddingLeft: 36,
      borderBottom: [1, 'dotted', [255, 255, 255, 0.1]],
    },
  }
}
