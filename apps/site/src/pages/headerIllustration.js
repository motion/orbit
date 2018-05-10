import * as React from 'react'
import CountUp from 'react-countup'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Trail from '~/trail'
import { Keyframes, Spring, animated, config, interpolate } from 'react-spring'
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
  props.active ? (
    <Badge>
      <Count {...props} />
    </Badge>
  ) : null

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
  state = {
    bounceSlack: false,
    bounceDropbox: false,
    bounceMail: false,
    bounceDrive: false,
    bounceGithub: false,
  }

  async componentDidMount() {
    await this.chatFrame(Spring, {
      from: { scale: 1, opacity: 0, y: 0 },
      to: { scale: 1, opacity: 0, y: 0 },
    })
    await sleep(800)
    await this.chats(Trail, {
      from: { opacity: 0, y: -20 },
      to: { opacity: 1, y: 0 },
      config: { tension: 100, friction: 20 },
      delay: [650, 650, 650, 650, 650],
    })
    await sleep(5000)
    this.bounceIcons()
    this.chatFrame(Spring, {
      to: { scale: 0.4, opacity: 1, y: -250 },
      config: config.fast,
    })
    await sleep(3000)
    this.chatFrame(Spring, {
      to: { scale: 0.3, opacity: 0.4, y: -450 },
      config: config.fast,
    })
    await sleep(3000)
    this.chatFrame(Spring, {
      to: { scale: 0.2, opacity: 0, y: -550 },
      config: config.fast,
    })
    await sleep(3000)
    this.setState({
      bounceSlack: false,
      bounceDropbox: false,
      bounceMail: false,
      bounceDrive: false,
      bounceGithub: false,
    })
    await this.leaveIcons()
    await sleep(1000)
    await this.chatText(Spring, {
      from: { opacity: 0 },
      to: { opacity: 1 },
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
    const chats = [
      <Bubble left>The #general chat room</Bubble>,
      <Bubble>Clear as modern art</Bubble>,
      <Bubble left>🙄</Bubble>,
      <Bubble>and spreading like an oil spill...</Bubble>,
      <Bubble left>🤷‍</Bubble>,
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
                    <LongChats />
                  </animated.div>
                </animated.div>
              )
            }}
          </Keyframes>
          <Keyframes native script={next => (this.chatText = next)}>
            {({ opacity }) => (
              <animated.div style={{ opacity }}>
                <P $message size={1.2} fontWeight={800}>
                  Feel like your organization<br />
                  has no organization?
                </P>
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
          </dock>
        </dockContain>
        <dockIcons
          css={{
            position: 'absolute',
            bottom: 120,
            left: 40,
            right: -10,
            height: 100,
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
    message: {
      position: 'absolute',
      bottom: 500,
      left: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
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
