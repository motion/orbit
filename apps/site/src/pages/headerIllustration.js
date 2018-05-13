import * as React from 'react'
import CountUp from 'react-countup'
import { PurchaseButton } from '~/views'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Trail from '~/trail'
import { Keyframes, Spring, animated, config, interpolate } from 'react-spring'
import * as Constants from '~/constants'
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

const Bubble = view(
  'div',
  {
    border: [1, '#777'],
    background: '#fff',
    fontSize: 16,
    borderRadius: 15,
    padding: 10,
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
    chromeless: {
      // border: 'none',
      // transformOrigin: 'center left',
      // transform: {
      //   scale: 1.5,
      // },
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
  <Bubble left>The #general chat room</Bubble>,
  <Bubble>clear as modern art</Bubble>,
  <Bubble left chromeless>
    🙄
  </Bubble>,
  <Bubble>spreading like an oil spill...</Bubble>,
  <Bubble left chromeless>
    🤷‍
  </Bubble>,
  <Bubble left>The #general chat room</Bubble>,
  <Bubble>clear as modern art</Bubble>,
  <Bubble left chromeless>
    🙄
  </Bubble>,
  <Bubble>spreading like an oil spill...</Bubble>,
  <Bubble left chromeless>
    🤷‍
  </Bubble>,
  <Bubble left>The #general chat room</Bubble>,
  <Bubble>clear as modern art</Bubble>,
  <Bubble left chromeless>
    Lorem ipsum dolor sit amet consectetur adipisicing elit.
  </Bubble>,
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
    await this.chatFrame(Spring, {
      from: { scale: 1, opacity: 0, y: 0 },
      to: { scale: 1, opacity: 0, y: 0 },
    })
    this.animateChats()
    this.animateIcons()
  }

  async animateIcons() {
    await sleep(4000)
    this.bounceIcons()
    await sleep(6000)
    this.setState({
      bounceSlack: 2,
      bounceDropbox: 2,
      bounceMail: 2,
      bounceDrive: 2,
      bounceGithub: 2,
    })
    await sleep(1000)
    await this.leaveIcons()
  }

  async animateChats() {
    await sleep(800)
    this.chatFrame(Spring, {
      to: { scale: 1, opacity: 1, y: 0 },
      config: config.fast,
    })
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
        400,
      ].slice(0, chats.length),
    })
    await sleep(6200)
    this.chatFrame(Spring, {
      to: { scale: 0.6, opacity: 1, y: -400 },
      config: { tension: 10, friction: 50 },
    })
    await sleep(2500)
    this.chatFrame(Spring, {
      to: { scale: 0.6, opacity: 0.6, y: -500 },
      config: { tension: 25, friction: 50 },
    })
    await sleep(2500)
    this.chatFrame(Spring, {
      to: { scale: 0.6, opacity: 0, y: -1000 },
      config: { tension: 20, friction: 50 },
    })
    await sleep(1500)
    await this.chatText(Spring, {
      from: { opacity: 0 },
      to: { opacity: 1 },
    })
    await sleep(700)
    await this.chatText(Spring, {
      from: { opacity: 1 },
      to: { opacity: 0 },
      config: config.slow,
    })
    await this.chatText2(Spring, {
      from: { opacity: 0 },
      to: { opacity: 1 },
      config: config.slow,
    })
  }

  bounceIcons = async () => {
    this.setState({ bounceSlack: true })
    await sleep(1000)
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
        <chats>
          <Keyframes
            reset={this.state.reset}
            native
            script={next => (this.chatFrame = next)}
          >
            {({ scale, opacity, y }) => {
              return (
                <animated.div
                  style={{
                    opacity,
                    transform: interpolate(
                      [scale, y],
                      (scale, y) => `translate3d(0,${y}px,0) scale(${scale})`,
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
                      opacity,
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
                <P $message size={1.3} fontWeight={800}>
                  Feels like your organization<br />
                  is lacking organization?
                </P>
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
                <P $message size={1.3} fontWeight={800}>
                  Stay in sync, stress free.
                  <PurchaseButton css={{ margin: [20, 'auto', -20] }}>
                    Learn more
                  </PurchaseButton>
                </P>
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
            borderBottom: [4, '#f2f2f2'],
            background: `linear-gradient(transparent, ${
              Constants.BACKGROUND_ALT
            })`,
            zIndex: 0,
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
                background: `linear-gradient(transparent, ${
                  Constants.BACKGROUND_ALT
                })`,
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
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexFlow: 'row',
            overflow: 'hidden',
          }}
        >
          <DropboxIcon
            $icon
            $bouncy={this.state.bounceDropbox}
            $leave={this.state.leaveDropbox}
            size={0.13}
            after={
              <CountBadge
                active={this.state.bounceDropbox}
                duration={15}
                start={0}
                end={22}
              />
            }
          />
          <DriveIcon
            $icon
            $bouncy={this.state.bounceDrive}
            $leave={this.state.leaveDrive}
            size={0.16}
            after={
              <CountBadge
                active={this.state.bounceDrive}
                duration={15}
                start={0}
                end={12}
              />
            }
          />
          <SlackIcon
            size={0.18}
            $icon
            $bouncy={this.state.bounceSlack}
            $leave={this.state.leaveSlack}
            after={
              <CountBadge
                active={this.state.bounceSlack}
                duration={15}
                start={0}
                end={122}
              />
            }
          />
          <MailIcon
            $icon
            $bouncy={this.state.bounceMail}
            $leave={this.state.leaveMail}
            size={0.16}
            after={
              <CountBadge
                active={this.state.bounceMail}
                duration={15}
                start={0}
                end={3}
              />
            }
          />
          <GithubIcon
            $icon
            $bouncy={this.state.bounceGithub}
            $leave={this.state.leaveGithub}
            size={0.13}
            after={
              <CountBadge
                active={this.state.bounceGithub}
                duration={15}
                start={0}
                end={12}
              />
            }
          />
        </dockIcons>
      </headerIll>
    )
  }

  static style = {
    headerIll: {
      position: 'relative',
      height: '100%',
    },
    chats: {
      // pointerEvents: 'none',
      position: 'absolute',
      top: 320,
      right: '5%',
      left: 50,
      bottom: 0,
      // alignItems: 'center',
      justifyContent: 'flex-start',
      transformOrigin: 'center right',
      transform: {
        // x: 30,
        scale: 1.15,
      },
    },
    message: {
      position: 'absolute',
      top: 120,
      left: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      pointerEvents: 'auto',
    },
    bouncy: {
      transition: 'all ease-in 100ms',
      animation: 'bounceIn 3s',
      transformOrigin: 'center bottom',
    },
    icon: {
      transition: 'opacity ease-out 100ms, transform ease-out 300ms',
    },
    leave: {
      opacity: 0,
      transform: {
        y: 50,
      },
    },
  }
}
