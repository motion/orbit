import { view } from '@mcro/black'
import * as React from 'react'
import * as View from '~/views'
import * as UI from '@mcro/ui'

const headerMain = '#4f78de'
const headerSecondary = '#7d43bc'

@view
export default class SectionChat extends React.Component {
  render() {
    return (
      <section css={{ position: 'relative' }}>
        <UI.Theme name="dark">
          <View.Section css={{ background: 'linear-gradient(#111, #000)' }}>
            <View.SectionContent padRight $section>
              <View.Title size={3}>Welcome to space</View.Title>
              <UI.Theme name="light">
                <fakeSlack>
                  <buttons>
                    <chrome $$background="#ED6A5E" />
                    <chrome $$background="#F6BF50" />
                    <chrome $$background="#62C655" />
                  </buttons>

                  <content $$row>
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
                            icon: 'hash',
                            category: 'Channels',
                          },
                          {
                            primary: 'general',
                            icon: 'hash',
                            category: 'Channels',
                          },
                          {
                            primary: 'research',
                            icon: 'hash',
                            category: 'Channels',
                          },
                          {
                            primary: 'showoff',
                            icon: 'hash',
                            category: 'Channels',
                          },
                          {
                            primary: 'status',
                            icon: 'hash',
                            category: 'Channels',
                          },
                          {
                            primary: 'tech',
                            icon: 'hash',
                            category: 'Channels',
                          },
                          {
                            primary: 'users',
                            icon: 'hash',
                            category: 'Channels',
                          },
                          { primary: 'ux', icon: 'hash', category: 'Channels' },
                          {
                            primary: 'watercooler',
                            icon: 'hash',
                            category: 'Channels',
                          },
                          {
                            primary: 'slackbot',
                            icon: 'hash',
                            category: 'Direct Messages',
                          },
                          {
                            primary: 'nate',
                            icon: 'hash',
                            category: 'Direct Messages',
                          },
                          {
                            primary: 'nick',
                            icon: 'hash',
                            category: 'Direct Messages',
                          },
                        ]}
                      />
                    </channels>
                    <messages>
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
    section: {
      padding: [100, 0],
    },
    fakeSlack: {
      background: '#fff',
      position: 'relative',
      borderRadius: 5,
      border: [1, [0, 0, 0, 0.1]],
      transform: {
        scale: 0.75,
        x: '-25%',
      },
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
      background: '#f2f2f2',
      borderRight: [1, [0, 0, 0, 0.1]],
      padding: 10,
      paddingTop: 30,
    },
    room: {
      width: 50,
      height: 50,
      background: '#ddd',
      borderRadius: 5,
      marginBottom: 10,
    },
    channels: {
      background: '#fcfcfc',
      borderRight: [1, [0, 0, 0, 0.1]],
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
