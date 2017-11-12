import { view } from '@mcro/black'
import * as React from 'react'
import * as View from '~/views'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'

@view
export default class SectionChat extends React.Component {
  render() {
    return (
      <section css={{ position: 'relative' }}>
        <UI.Theme name="dark">
          <View.Section
            css={{
              background: '#7b99d9',
              padding: [210, 0],
            }}
          >
            <background
              $$fullscreen
              css={{
                background: `url(/wallpaper.jpg) no-repeat`,
                backgroundSize: 'cover',
                opacity: 0.28,
              }}
            />
            <View.SectionContent padRight>
              <View.Title size={3}>Wherever you are</View.Title>
              <View.SubTitle>
                Unlike a browser extension or bot, Ora lives on your desktop and
                works across many apps.
              </View.SubTitle>
              <View.Text>
                <View.Hl>Slack</View.Hl> Email Browser Search
              </View.Text>
              <UI.Theme name="light">
                <fakeSlack>
                  <buttons $section>
                    <chrome $$background="#ED6A5E" />
                    <chrome $$background="#F6BF50" />
                    <chrome $$background="#62C655" />
                  </buttons>

                  <content $section $$row>
                    <rooms>
                      <room />
                      <room />
                      <room />
                    </rooms>
                    <channels>
                      <UI.Text
                        size={1.2}
                        fontWeight={600}
                        css={{ padding: [10, 20, 0] }}
                      >
                        Orbit Dev Team
                      </UI.Text>
                      <UI.List
                        groupBy="category"
                        items={[
                          {
                            primary: 'All Threads',
                            icon: 'chat',
                            category: ' ',
                          },
                          {
                            primary: 'brand',
                            category: 'Channels',
                          },
                          {
                            primary: 'general',
                            category: 'Channels',
                          },
                          {
                            primary: 'research',
                            category: 'Channels',
                          },
                          {
                            primary: 'showoff',
                            category: 'Channels',
                          },
                          {
                            primary: 'status',
                            category: 'Channels',
                          },
                          {
                            primary: 'tech',
                            category: 'Channels',
                          },
                          {
                            primary: 'users',
                            category: 'Channels',
                          },
                          {
                            primary: 'watercooler',
                            category: 'Channels',
                          },
                          {
                            primary: 'slackbot',
                            category: 'Direct Messages',
                          },
                          {
                            primary: 'nate',
                            category: 'Direct Messages',
                          },
                          {
                            primary: 'nick',
                            category: 'Direct Messages',
                          },
                        ]}
                      />
                    </channels>
                    <messages $section>
                      <header
                        css={{
                          padding: [10, 10, 0],
                          borderBottom: [1, [0, 0, 0, 0.1]],
                        }}
                      >
                        <UI.Text size={1.5} fontWeight={600}>
                          #showoff
                        </UI.Text>
                        <search>Search</search>
                      </header>
                      <chats>
                        <chat>hi</chat>
                      </chats>
                      <inputBar>
                        <UI.Button flex={1} borderRadius={0} icon="add">
                          Message #showoff
                        </UI.Button>
                      </inputBar>
                    </messages>
                  </content>
                </fakeSlack>
              </UI.Theme>
            </View.SectionContent>
          </View.Section>
        </UI.Theme>
      </section>
    )
  }

  static style = {
    fakeSlack: {
      background: '#fff',
      position: 'relative',
      borderRadius: 5,
      width: 700,
      height: 500,
      border: [1, [0, 0, 0, 0.05]],
      boxShadow: [[0, 0, 120, [0, 0, 0, 0.12]]],
      // transform: {
      //   x: '-25%',
      // },
    },
    section: {
      flex: 1,
    },
    buttons: {
      position: 'absolute',
      top: 5,
      left: 0,
      flexFlow: 'row',
    },
    chrome: {
      width: 15,
      height: 15,
      marginLeft: 5,
      borderRadius: 100,
      background: '#eee',
    },
    rooms: {
      background: [0, 0, 0, 0.03],
      borderRight: [1, [0, 0, 0, 0.05]],
      padding: 10,
      paddingTop: 30,
    },
    room: {
      width: 50,
      height: 50,
      background: [0, 0, 0, 0.03],
      borderRadius: 5,
      marginBottom: 10,
    },
    channels: {
      background: [0, 0, 0, 0.02],
      borderRight: [1, [0, 0, 0, 0.05]],
    },
    messages: {
      flex: 1,
    },
    chats: {
      flex: 1,
      justifyContent: 'flex-end',
    },
  }
}
