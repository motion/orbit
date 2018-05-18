import * as React from 'react'
import CountUp from 'react-countup'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Trail from '~/trail'
import { Keyframes, Spring, animated, config, interpolate } from 'react-spring'
import * as Icons from '~/views/icons'
import Router from '~/router'

const bgColor = '#fff'

const P = props => <UI.Text selectable css={{ display: 'block' }} {...props} />
const sleep = ms => new Promise(res => setTimeout(res, ms))

const Badge = view('div', {
  position: 'absolute',
  top: -5,
  right: 5,
  width: 24,
  height: 24,
  background: 'red',
  color: '#fff',
  borderRadius: 100,
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  fontWeight: 600,
  fontSize: 12,
  letterSpacing: -1,
  boxShadow: '0 0 5px rgba(0,0,0,0.5)',
})

const Bubble = view(
  'div',
  {
    border: [1, '#ccc'],
    fontSize: 18,
    borderRadius: 15,
    padding: [10, 12],
    marginBottom: 10,
    borderBottomRightRadius: 0,
    alignSelf: 'flex-end',
    pointerEvents: 'all',
  },
  {
    left: {
      alignSelf: 'flex-start',
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 0,
    },
  },
)

const Count = ({ active, ...props }) =>
  active ? <CountUp {...props} /> : props.start

const CountBadge = props =>
  props.active === 1 ? (
    <Badge>{props.end}</Badge>
  ) : props.active ? (
    <Badge>
      <Count {...props} />
    </Badge>
  ) : null

const INITIAL_STATE = {
  bounceSlack: false,
  bounceDropbox: false,
  bounceMail: false,
  bounceDrive: false,
  bounceGithub: false,
}

const chats = [
  <Bubble left>The #dev chat room</Bubble>,
  <Bubble>clear as modern art</Bubble>,
  <Bubble left>🙄</Bubble>,
  <Bubble>& spreading like an oil spill...</Bubble>,
  <Bubble left>🤷‍</Bubble>,
  <Bubble left>It's not that it doesn't work</Bubble>,
  <Bubble>Yea, but you'd hope for a bit more...</Bubble>,
  <Bubble left>clarity, perhaps</Bubble>,
  <Bubble>at least some sort of summary</Bubble>,
  <Bubble left>👆</Bubble>,
  <Bubble left>too much FOMO</Bubble>,
  <Bubble>unsubscribe</Bubble>,
]

const messages = (
  <React.Fragment>
    <Bubble>Lorem ipsume dolor sit.</Bubble>
    <Bubble left>Lorem ipsume dolor sit.</Bubble>
    <Bubble left>Lorem ipsume dolor sit.</Bubble>
    <Bubble>Lorem ipsume dolor sit.</Bubble>
    <Bubble>Lorem ipsume dolor sit.</Bubble>
    <Bubble left>Lorem ipsume dolor sit.</Bubble>
    <Bubble>Lorem ipsume dolor sit.</Bubble>
    <Bubble left>Lorem ipsume dolor sit.</Bubble>
    <Bubble>Lorem ipsume dolor sit.</Bubble>
    <Bubble left>Lorem ipsume dolor sit.</Bubble>
    <Bubble>Lorem ipsume dolor sit.</Bubble>
    <Bubble left>Lorem ipsume dolor sit.</Bubble>
    <Bubble>Lorem ipsume dolor sit.</Bubble>
    <Bubble left>Lorem ipsume dolor sit.</Bubble>
    <Bubble left>Lorem ipsume dolor sit.</Bubble>
    <Bubble>Lorem ipsume dolor sit.</Bubble>
    <Bubble>Lorem ipsume dolor sit.</Bubble>
    <Bubble left>Lorem ipsume dolor sit.</Bubble>
    <Bubble>Lorem ipsume dolor sit.</Bubble>
    <Bubble left>Lorem ipsume dolor sit.</Bubble>
    <Bubble>Lorem ipsume dolor sit.</Bubble>
    <Bubble left>Lorem ipsume dolor sit.</Bubble>
    <Bubble>Lorem ipsume dolor sit.</Bubble>
    <Bubble left>Lorem ipsume dolor sit.</Bubble>
    <Bubble>Lorem ipsume dolor sit.</Bubble>
    <Bubble left>Lorem ipsume dolor sit.</Bubble>
    <Bubble left>Lorem ipsume dolor sit.</Bubble>
    <Bubble>Lorem ipsume dolor sit.</Bubble>
    <Bubble>Lorem ipsume dolor sit.</Bubble>
    <Bubble left>Lorem ipsume dolor sit.</Bubble>
    <Bubble>Lorem ipsume dolor sit.</Bubble>
    <Bubble left>Lorem ipsume dolor sit.</Bubble>
    <Bubble>Lorem ipsume dolor sit.</Bubble>
    <Bubble left>Lorem ipsume dolor sit.</Bubble>
    <Bubble>Lorem ipsume dolor sit.</Bubble>
    <Bubble left>Lorem ipsume dolor sit.</Bubble>
    <Bubble>Lorem ipsume dolor sit.</Bubble>
    <Bubble left>Lorem ipsume dolor sit.</Bubble>
    <Bubble left>Lorem ipsume dolor sit.</Bubble>
    <Bubble>Lorem ipsume dolor sit.</Bubble>
    <Bubble>Lorem ipsume dolor sit.</Bubble>
    <Bubble left>Lorem ipsume dolor sit.</Bubble>
    <Bubble>Lorem ipsume dolor sit.</Bubble>
    <Bubble left>Lorem ipsume dolor sit.</Bubble>
    <Bubble>Lorem ipsume dolor sit.</Bubble>
    <Bubble left>Lorem ipsume dolor sit.</Bubble>
    <Bubble>Lorem ipsume dolor sit.</Bubble>
    <Bubble left>Lorem ipsume dolor sit.</Bubble>
  </React.Fragment>
)

@view
class LongChats {
  render() {
    return messages
  }
}

@view
export default class HeaderIllustration extends React.Component {
  state = INITIAL_STATE

  // async onReload() {
  //   this.animate()
  // }

  animate = async () => {
    this.setState({ reset: true })
    this.setState(INITIAL_STATE)
    await sleep(100)
    this.setState({ reset: false })
    await sleep(100)
    this.componentDidMount()
  }

  componentDidMount() {
    this.startAnimations()
  }

  startAnimations = async () => {
    this.animateChats()
    this.animateIcons()
  }

  async animateIcons() {
    await sleep(2000)
    this.bounceIcons()
    await sleep(6000)
    this.setState({
      bounceSlack: 2,
      bounceDropbox: 2,
      bounceMail: 2,
      bounceDrive: 2,
      bounceGithub: 2,
    })
    await sleep(3000)
    await this.leaveIcons()
  }

  async animateChats() {
    await this.chatFrame(Spring, {
      from: { scale: 1, opacity: 0, opacityRest: 0, y: 0 },
      to: { scale: 1, opacity: 1, opacityRest: 0, y: 0 },
    })
    await sleep(800)
    await this.chats(Trail, {
      from: { opacity: 0, y: -20 },
      to: { opacity: 1, y: 0 },
      config: { tension: 20, friction: 4 },
      delay: [
        300,
        1300,
        1300,
        1300,
        1300,
        800,
        800,
        500,
        500,
        500,
        400,
        400,
      ].slice(0, chats.length),
    })
    await sleep(6200)
    this.chatFrame(Spring, {
      to: { scale: 0.6, opacity: 1, opacityRest: 1, y: -400 },
      config: { tension: 10, friction: 50 },
    })
    await sleep(2500)
    this.chatFrame(Spring, {
      to: { scale: 0.6, opacity: 0.6, y: -500 },
      config: { tension: 25, friction: 50 },
    })
    await sleep(2500)
    this.chatFrame(Spring, {
      to: { scale: 0.6, opacity: 0.2, y: -1000 },
      config: { tension: 20, friction: 50 },
    })
    await sleep(1500)
    await this.chatText(Spring, {
      from: { opacity: 0 },
      to: { opacity: 1 },
    })
    await sleep(700)
    this.chatText(Spring, {
      from: { opacity: 1 },
      to: { opacity: 0 },
      config: config.slow,
    })
    await sleep(1000)
    await this.chatText2(Spring, {
      from: { opacity: 0 },
      to: { opacity: 1 },
      config: config.slow,
    })
  }

  bounceIcons = async () => {
    this.setState({ bounceSlack: true })
    await sleep(4000)
    this.setState({ bounceDropbox: true })
    await sleep(200)
    this.setState({ bounceMail: true })
    this.setState({ bounceDrive: true })
    await sleep(300)
    this.setState({ bounceGithub: true })
  }

  leaveIcons = async () => {
    this.setState({ leaveDropbox: true })
    await sleep(200)
    this.setState({ leaveMail: true })
    this.setState({ leaveDrive: true })
    await sleep(300)
    this.setState({ leaveGithub: true })
    await sleep(1000)
    this.setState({ leaveSlack: true })
  }

  render() {
    return (
      <headerIll>
        <fades
          $$fullscreen
          css={{
            pointerEvents: 'none',
            background: `linear-gradient(to bottom, transparent 80%, ${bgColor} 95%), linear-gradient(to top, transparent 80%, ${bgColor} 95%)`,
            zIndex: 100,
          }}
        />
        <chats>
          <Keyframes
            reset={this.state.reset}
            native
            script={next => (this.chatFrame = next)}
          >
            {({ scale, opacity, opacityRest, y }) => {
              return (
                <animated.div
                  style={{
                    opacity,
                    transform: interpolate(
                      [scale, y],
                      (scale, y) =>
                        `translate3d(0,${y + 110}px,0) scale(${scale})`,
                    ),
                  }}
                >
                  <Keyframes
                    reset={this.state.reset}
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
                      opacity: opacityRest,
                      height: 500,
                    }}
                  >
                    <LongChats />
                  </animated.div>
                </animated.div>
              )
            }}
          </Keyframes>
          <Keyframes
            reset={this.state.reset}
            native
            script={next => (this.chatText = next)}
          >
            {({ opacity }) => (
              <animated.div style={{ opacity }}>
                <message>
                  <msgBlur />
                  Is your organization<br />
                  lacking organization?
                </message>
              </animated.div>
            )}
          </Keyframes>
          <Keyframes
            reset={this.state.reset}
            native
            script={next => (this.chatText2 = next)}
          >
            {({ opacity }) => (
              <animated.div style={{ opacity }}>
                <message>
                  <msgBlur />
                  Stay in sync, stress free.
                  <UI.Row
                    spaced
                    itemProps={{
                      size: 1.1,
                      alpha: 0.8,
                    }}
                    css={{
                      flexFlow: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: [20, 0, 0],
                    }}
                  >
                    <UI.Button onClick={Router.link('/features')}>
                      Features
                    </UI.Button>
                    <UI.Button onClick={Router.link('/use-cases')}>
                      Use Cases
                    </UI.Button>
                  </UI.Row>
                </message>
              </animated.div>
            )}
          </Keyframes>
        </chats>

        <dockContain
          css={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: `linear-gradient(transparent, ${bgColor})`,
            zIndex: 200,
            transition: 'all ease-out 1000ms',
            opacity: this.state.leaveSlack ? 0 : 1,
          }}
        >
          <dock
            css={{
              position: 'absolute',
              bottom: 15,
              right: 0,
              left: 0,
              background: '#f9f9f9',
              borderTopRadius: 10,
              padding: [0, 20, 10],
              height: 100,
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              border: [1, '#ddd'],
              transformOrigin: 'top center',
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
                background: `linear-gradient(transparent, ${bgColor})`,
              }}
            />
          </dock>
        </dockContain>
        <dockIcons
          css={{
            position: 'absolute',
            bottom: 25,
            left: 40,
            right: 40,
            height: 120,
            zIndex: 201,
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            padding: [0, 15],
            flexFlow: 'row',
            overflow: 'hidden',
          }}
        >
          {[
            {
              name: 'Dropbox',
              size: 0.13,
              countProps: { start: 0, end: 22, duration: 15 },
            },
            {
              name: 'Drive',
              size: 0.16,
              countProps: { start: 0, end: 36, duration: 15 },
            },
            {
              name: 'Slack',
              size: 0.18,
              countProps: { start: 0, end: 122, duration: 15 },
            },
            {
              name: 'Mail',
              size: 0.16,
              countProps: { start: 0, end: 195, duration: 15 },
            },
            {
              name: 'Github',
              size: 0.13,
              countProps: { start: 0, end: 27, duration: 15 },
            },
          ].map(({ name, size, countProps }) => {
            const Icon = Icons[`${name}Icon`]
            const bounce = this.state[`bounce${name}`]
            const leave = this.state[`leave${name}`]
            const countHigher = bounce === 2
            return this.glossElement(Icon, {
              key: name,
              $icon: true,
              $bouncy: bounce,
              $leave: leave,
              size,
              after: (
                <CountBadge
                  active={bounce}
                  {...countProps}
                  start={countHigher ? countProps.end : countProps.start}
                  end={countProps.end * (countHigher ? 2 : 1)}
                />
              ),
            })
          })}
        </dockIcons>
      </headerIll>
    )
  }

  static style = {
    headerIll: {
      position: 'relative',
      height: 700,
      width: '100%',
      margin: 'auto',
      overflow: 'hidden',
      // transform: {
      //   y: 100,
      // },
    },
    chats: {
      // pointerEvents: 'none',
      position: 'absolute',
      top: 0,
      right: '5%',
      left: '5%',
      bottom: 0,
      justifyContent: 'flex-start',
      overflow: 'hidden',
    },
    message: {
      color: '#999',
      fontWeight: 400,
      fontSize: 26,
      lineHeight: '34px',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      pointerEvents: 'auto',
    },
    msgBlur: {
      zIndex: -1,
      position: 'absolute',
      alignSelf: 'center',
      display: 'flex',
      content: ' ',
      width: '60%',
      height: '40%',
      background: bgColor,
      filter: {
        blur: 55,
      },
    },
    bouncy: {
      transition: 'all ease-in 100ms',
      animation: 'bounceIn 3s',
      transformOrigin: 'center bottom',
    },
    icon: {
      transition: 'all ease-in 100ms',
    },
    leave: {
      // opacity: 0.5,
      filter: {
        // grayscale: '100%',
        // brightness: '100%',
      },
    },
  }
}
