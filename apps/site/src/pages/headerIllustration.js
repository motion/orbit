import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import {
  Keyframes,
  Trail,
  Spring,
  animated,
  config,
  interpolate,
} from 'react-spring'
// import Trail from '~/trail'
import {
  DropboxIcon,
  DriveIcon,
  SlackIcon,
  MailIcon,
  GithubIcon,
} from '~/views/icons'

const P = props => <UI.Text selectable css={{ display: 'block' }} {...props} />
const sleep = ms => new Promise(res => setTimeout(res, ms))

const Badge = view('div', {
  position: 'absolute',
  top: -5,
  right: 5,
  width: 25,
  height: 25,
  background: 'red',
  color: '#fff',
  borderRadius: 100,
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  fontWeight: 600,
  boxShadow: '0 0 5px rgba(0,0,0,0.5)',
})

@view
export default class HeaderIllustration {
  async componentDidMount() {
    await this.chatFrame(Spring, {
      from: { scale: 1, opacity: 0, y: 0 },
      to: { scale: 1, opacity: 0, y: 0 },
    })
    await sleep(1000)
    await this.chats(Trail, {
      from: { opacity: 0, y: -20 },
      to: { opacity: 1, y: 0 },
      config: config.slow,
    })
    await sleep(500)
    this.chatFrame(Spring, {
      to: { scale: 0.3, opacity: 1, y: -200 },
      config: config.slow,
    })
    await sleep(1000)
    await this.chatFrame(Spring, {
      to: { scale: 0.2, opacity: 0.3, y: -500 },
      config: config.slow,
    })
    await sleep(200)
    await this.chatText(Spring, {
      from: { opacity: 0 },
      to: { opacity: 1 },
    })
  }

  render() {
    const chats = [
      <bubble $left>The #general chat room</bubble>,
      <bubble>About as coherent as an acid trip</bubble>,
      <bubble $left>🙄</bubble>,
      <bubble>Spreading like an oil spill...</bubble>,
      <bubble $left>Clear as modern art 🖌</bubble>,
    ]

    return (
      <headerIll>
        <chats>
          <Keyframes native script={next => (this.chatFrame = next)}>
            {({ scale, opacity, y }) => {
              console.log('okk', y._value)
              return (
                <animated.div
                  style={{
                    transform: interpolate(
                      [scale, y],
                      (scale, y) => `translate3d(0,${y}px,0) scale(${scale})`,
                    ),
                  }}
                >
                  <Keyframes
                    native
                    keys={chats.map((_, i) => i)}
                    script={next => (this.chats = next)}
                  >
                    {chats.map(chat => ({ y, opacity }) => (
                      <animated.div
                        style={{
                          opacity,
                          transform: y.interpolate(
                            y => `translate3d(0,${y}%,0)`,
                          ),
                        }}
                      >
                        {chat}
                      </animated.div>
                    ))}
                  </Keyframes>
                  <animated.div
                    style={{
                      opacity,
                      height: opacity._value === 0 ? 0 : 500,
                    }}
                  >
                    {chats.map(chat => chat)}
                    {chats.map(chat => chat)}
                    {chats.map(chat => chat)}
                    {chats.map(chat => chat)}
                    {chats.map(chat => chat)}
                  </animated.div>
                </animated.div>
              )
            }}
          </Keyframes>
          <Keyframes native script={next => (this.chatText = next)}>
            {({ opacity }) => (
              <animated.div style={{ opacity }}>
                <message>
                  <P size={1.2}>It's time things made more sense.</P>
                </message>
              </animated.div>
            )}
          </Keyframes>
        </chats>

        <dockContain
          css={{
            position: 'absolute',
            bottom: 90,
            left: 0,
            right: -50,
            borderBottom: [4, '#f2f2f2'],
            zIndex: 0,
          }}
        >
          <dock
            css={{
              position: 'absolute',
              bottom: 15,
              right: 0,
              left: 0,
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexFlow: 'row',
              background: '#f9f9f9',
              borderTopRadius: 10,
              padding: [0, 20, 10],
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              border: [1, '#ddd'],
              transform: {
                scale: 0.9,
              },
            }}
          >
            <dockFade
              css={{
                position: 'absolute',
                top: 0,
                left: -10,
                right: -10,
                bottom: -10,
                background: 'linear-gradient(transparent, #fff)',
              }}
            />
            <DropboxIcon size={0.13} after={<Badge>12</Badge>} />
            <DriveIcon size={0.16} after={<Badge>5</Badge>} />
            <SlackIcon size={0.18} after={<Badge>89</Badge>} />
            <MailIcon size={0.16} after={<Badge>3</Badge>} />
            <GithubIcon size={0.13} after={<Badge>22</Badge>} />
          </dock>
        </dockContain>
      </headerIll>
    )
  }

  static style = {
    chats: {
      pointerEvents: 'none',
      position: 'absolute',
      top: 0,
      right: '5%',
      left: 50,
      bottom: 0,
      // alignItems: 'center',
      justifyContent: 'center',
      transform: {
        // x: 30,
        scale: 1.15,
      },
    },
    bubble: {
      border: [2, '#777'],
      background: '#fff',
      fontSize: 16,
      borderRadius: 15,
      padding: 10,
      marginBottom: 10,
      borderBottomRightRadius: 0,
      alignSelf: 'flex-end',
      pointerEvents: 'auto',
    },
    left: {
      alignSelf: 'flex-start',
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 0,
    },
    message: {
      position: 'absolute',
      bottom: 400,
      left: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }
}
