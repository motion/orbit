import * as React from 'react'
import CountUp from 'react-countup'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import Trail from '~/trail'
import { Keyframes, Spring, animated, config, interpolate } from 'react-spring'
import * as Icons from '~/views/icons'
import Router from '~/router'
import { scrollTo } from '~/helpers'

const bgColor = '#fff'
const dockIcons = [
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
]

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
    <Bubble>this shows good potential</Bubble>
    <Bubble left>the icon isn’t good that you have now</Bubble>
    <Bubble left>
      and i think with some tweaking this could work as a logo concept -
      animation proves some extensibility too
    </Bubble>
    <Bubble>
      yeah, new idea is really close though to being what I think you would need
      to start shopping the concept around
    </Bubble>
    <Bubble>we actually have this indicator</Bubble>
    <Bubble left>
      that is prototype stage but meant to signify you have something relevant
    </Bubble>
    <Bubble>
      signifies that its a small thing that sort of hangs around with you
    </Bubble>
    <Bubble left>the little line is nice actually</Bubble>
    <Bubble>makes the logo 10x more identifiable</Bubble>
    <Bubble left>with some tweak maybe</Bubble>
    <Bubble>Lorem maybe rounded to the O</Bubble>
    <Bubble left>
      I think screens will really help. Going to try and add by tn
    </Bubble>
    <Bubble>
      but thinking about … that idea …. of, the answer to the ‘so what…’
    </Bubble>
    <Bubble left>
      “The one dashboard that Sauron would’ve made if he was a good guy.”
    </Bubble>
    <Bubble left>I need to get the screenshots in there</Bubble>
    <Bubble>
      maybe oil slick concept goes more like this for that first problem
      statement part
    </Bubble>
    <Bubble>
      also think that “unifying force for your team” may be too long
    </Bubble>
    <Bubble>
      may want to do some simple moire or comic dot-grid effects that sort of
      procedurally space-fill the empty areas with black/white checkers/dots
    </Bubble>
    <Bubble left>
      using ben-day dot pattern for the transition between the different
      sections could be a cool way to carry motif through it as well
    </Bubble>
    <Bubble left>
      mockups for graphite drawings I’m having produced in China
    </Bubble>
    <Bubble>based on our tests</Bubble>
  </React.Fragment>
)

@view
class LongChats {
  render() {
    return messages
  }
}

class IllustrationStore {
  animate = false
  bounce = {
    slack: false,
    dropbox: false,
    mail: false,
    drive: false,
    github: false,
  }
  leave = {
    slack: false,
    dropbox: false,
    mail: false,
    drive: false,
    github: false,
  }

  willMount() {
    setTimeout(() => {
      this.animate = true
    }, 300)
  }

  @react
  runAnimation = [
    () => this.animate,
    async (shouldAnimate, { sleep }) => {
      if (!shouldAnimate) {
        throw react.cancel
      }
      console.log(`running acnimat`)
      this.animateIcons(sleep)
      this.animateChats(sleep)
    },
  ]

  animateIcons = async sleep => {
    const bounceIcons = async () => {
      this.bounce.slack = true
      await sleep(4000)
      this.bounce.dropbox = true
      await sleep(200)
      this.bounce.mail = true
      this.bounce.drive = true
      await sleep(300)
      this.bounce.github = true
    }
    const leaveIcons = async () => {
      this.leave.dropbox = true
      await sleep(200)
      this.leave.mail = true
      this.leave.drive = true
      await sleep(300)
      this.leave.github = true
      await sleep(1000)
      this.leave.slack = true
    }
    await sleep(2000)
    bounceIcons()
    await sleep(6000)
    this.bounce.slack = 2
    this.bounce.dropbox = 2
    this.bounce.mail = 2
    this.bounce.drive = 2
    this.bounce.github = 2
    await sleep(3000)
    leaveIcons()
  }

  animateChats = async sleep => {
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
}

@view({
  store: IllustrationStore,
})
export default class HeaderIllustration {
  render({ store }) {
    return (
      <React.Fragment>
        <monitorWrap if={false}>
          <monitorFrame $$fullscreen />
        </monitorWrap>
        <headerIll>
          <fades $$fullscreen />
          <chats>
            <Keyframes native script={next => (store.chatFrame = next)}>
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
                      native
                      keys={chats.map((_, i) => i)}
                      script={next => (store.chats = next)}
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
            <Keyframes native script={next => (store.chatText = next)}>
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
            <Keyframes native script={next => (store.chatText2 = next)}>
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
                      <UI.Button onClick={scrollTo('#signup')}>Beta</UI.Button>
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
              opacity: store.leave.slack ? 0 : 1,
            }}
          >
            <dock>
              <dockFade />
            </dock>
          </dockContain>
          <dockIcons>
            {dockIcons.map(({ name, size, countProps }) => {
              const Icon = Icons[`${name}Icon`]
              const bounce = store.bounce[name.toLowerCase()]
              const leave = store.leave[name.toLowerCase()]
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
      </React.Fragment>
    )
  }

  static style = {
    headerIll: {
      position: 'relative',
      height: '80%',
      maxHeight: 800,
      width: '100%',
      margin: 'auto',
      overflow: 'hidden',
      zIndex: 0,
    },
    chats: {
      position: 'absolute',
      top: 0,
      right: '5%',
      left: '5%',
      bottom: 0,
      justifyContent: 'flex-start',
      overflow: 'hidden',
    },
    fades: {
      pointerEvents: 'none',
      background: `linear-gradient(to bottom, transparent 80%, ${bgColor} 95%), linear-gradient(to top, transparent 80%, ${bgColor} 95%)`,
      zIndex: 100,
    },
    dockContain: {
      position: 'absolute',
      bottom: 0,
      right: '5%',
      left: '5%',
      maxWidth: 600,
      background: `linear-gradient(transparent, ${bgColor})`,
      zIndex: 200,
      transition: 'all ease-out 1000ms',
    },
    dock: {
      position: 'absolute',
      bottom: 15,
      right: '5%',
      left: '5%',
      maxWidth: 600,
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
    },
    dockFade: {
      position: 'absolute',
      top: 0,
      left: -10,
      right: -10,
      bottom: -10,
      background: `linear-gradient(transparent, ${bgColor})`,
    },
    dockIcons: {
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
    },
    message: {
      color: '#444',
      fontWeight: 300,
      fontSize: 32,
      lineHeight: '42px',
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
      display: 'none',
      zIndex: -1,
      position: 'absolute',
      alignSelf: 'center',
      // display: 'flex',
      content: ' ',
      width: '60%',
      height: '40%',
      background: bgColor,
      filter: {
        blur: 55,
      },
    },
    monitorWrap: {
      position: 'absolute',
      top: 80,
      bottom: 60,
      left: 19,
      right: -50,
      overflow: 'hidden',
      pointerEvents: 'none',
    },
    monitorFrame: {
      margin: [50, 50, 50, 0],
      border: [2, '#f2f2f2'],
      // boxShadow: [[0, 0, 50, [0, 0, 0, 0.05]]],
      borderRightRadius: 10,
      borderLeft: 'none',
      zIndex: 1,
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
