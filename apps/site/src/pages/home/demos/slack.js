import { view } from '@mcro/black'
import * as React from 'react'
import * as UI from '@mcro/ui'

@view
export default class FakeSlack {
  render() {
    return (
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
                css={{ padding: [10, 20, 0, 10] }}
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
                  padding: 10,
                  paddingTop: 15,
                  borderBottom: [1, [0, 0, 0, 0.1]],
                }}
              >
                <UI.Text size={1.5} fontWeight={600}>
                  #showoff
                </UI.Text>
              </header>
              <chats>
                <chat $$row>
                  <img $avatar src="/steph.jpg" />
                  <chatContent $$flex>
                    <chatTitle $$row>
                      <strong>Steph</strong> &nbsp;<span $light>10:22 AM</span>
                    </chatTitle>
                    <message>
                      running into some crawl stuff thats breaking
                    </message>
                    <message>
                      for ex going to http://slatestarcodex.com/ and pressing
                      crawl it has trouble with finding stuff
                    </message>
                    <message>probably worth you taking a look</message>
                    <message>
                      slack sync is working now with as many messages as wanted
                    </message>
                    <message>
                      just needs some rate limit stuff built in but i can grab
                      10k messages easily
                    </message>
                    <message>
                      cleaned up some ui stuff, next is peek view i think and
                      various polish for slack sync
                    </message>
                  </chatContent>
                </chat>
              </chats>
              <inputBar $$row>
                <UI.Icon $preIcon size={18} name="add" opacity={0.3} />
                <inputArea $$row>
                  <text $$flex>Message #status</text>
                  <UI.Icon $postIcon size={18} name="smile" opacity={0.4} />
                </inputArea>
              </inputBar>
            </messages>
          </content>
        </fakeSlack>
      </UI.Theme>
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
      boxShadow: [[0, 0, 180, [0, 0, 0, 0.4]]],
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
      overflow: 'hidden',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 8,
      marginRight: 10,
      marginLeft: 10,
    },
    message: {
      padding: [5, 0],
      flex: 1,
      width: '100%',
      display: 'block',
    },
    inputBar: {
      margin: 10,
      padding: 10,
      border: [2, [0, 0, 0, 0.2]],
      borderRadius: 10,
      alignItems: 'center',
    },
    inputArea: {
      flex: 1,
    },
    preIcon: {
      marginRight: 10,
    },
  }
}
