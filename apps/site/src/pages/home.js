import * as React from 'react'
import { view } from '@mcro/black'
import Logo from '~/views/logo'
import * as UI from '@mcro/ui'
import { Section, SectionContent, Slant, PurchaseButton } from '~/views'
// import homeImg from '~/../public/screen-home.png'
import personImage from '~/../public/screen-person.png'
import wordImage from '~/../public/screen-context-word.png'
import homeImg from '~/../public/screen-home.png'
import Observer from '@researchgate/react-intersection-observer'
import { Trail, Spring, Keyframes, animated, config } from 'react-spring'
import HeaderIllustration from './headerIllustration'
import { MailIcon } from '~/views/icons'
import * as Constants from '~/constants'

const AppleLogo = props => (
  <svg width="170px" height="170px" viewBox="0 0 170 170" {...props}>
    <path d="m150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58 0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742 3.35-4.929 0.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378 0-10.857 2.346-20.221 7.045-28.068 3.693-6.303 8.606-11.275 14.755-14.925s12.793-5.51 19.948-5.629c3.915 0 9.049 1.211 15.429 3.591 6.362 2.388 10.447 3.599 12.238 3.599 1.339 0 5.877-1.416 13.57-4.239 7.275-2.618 13.415-3.702 18.445-3.275 13.63 1.1 23.87 6.473 30.68 16.153-12.19 7.386-18.22 17.731-18.1 31.002 0.11 10.337 3.86 18.939 11.23 25.769 3.34 3.17 7.07 5.62 11.22 7.36-0.9 2.61-1.85 5.11-2.86 7.51zm-31.26-123.01c0 8.1021-2.96 15.667-8.86 22.669-7.12 8.324-15.732 13.134-25.071 12.375-0.119-0.972-0.188-1.995-0.188-3.07 0-7.778 3.386-16.102 9.399-22.908 3.002-3.446 6.82-6.3113 11.45-8.597 4.62-2.2516 8.99-3.4968 13.1-3.71 0.12 1.0831 0.17 2.1663 0.17 3.2409z" />
  </svg>
)

const Animate = {
  Wiggle: view('div', {
    display: 'inline-block',
    // transition: 'all ease-in 100ms',
    transformOrigin: 'top center',
    animation: 'wiggle 5s infinite',
  }),
}

const IS_UPPER = /[A-Z]/
const changeCaps = (str, reducePct) =>
  typeof str === 'string'
    ? str
        .split('')
        .map(
          char =>
            IS_UPPER.test(char) ? (
              <span style={{ fontSize: `${100 - reducePct}%` }}>{char}</span>
            ) : (
              char
            ),
        )
    : str

const Title = ({ children, reduceCapsPct, size = 3.3, ...props }) => (
  <P
    size={size}
    fontWeight={800}
    margin={[0, 0, 5]}
    css={{
      fontFamily: '"Chronicle Display A", "Chronicle Display B"',
      // letterSpacing: size < 4 ? -1 : 0,
    }}
    // css={{ fontFamily: '"Chronicle Display A", "Chronicle Display B"' }}
    {...props}
  >
    {reduceCapsPct ? changeCaps(children, reduceCapsPct) : children}
  </P>
)

const SmallTitle = props => (
  <P
    size={1}
    fontWeight={700}
    textTransform="uppercase"
    alpha={0.5}
    padding={[0, 2]}
    margin={[0, 0, 5]}
    {...props}
  />
)

const RightSide = ({ children, inverse, noEdge, ...props }) => (
  <rightSide
    css={{
      zIndex: 3,
      flex: 1,
      position: 'absolute',
      left: '50%',
      right: 0,
      bottom: 80,
      top: 80,
      paddingRight: 20,
      justifyContent: 'center',
    }}
    {...props}
  >
    <inner
      if={!noEdge}
      css={{
        display: 'block',
      }}
    >
      <edge
        css={{
          shapeOutside: inverse
            ? 'polygon(26% 0%, 0% 1px, 93% 1096px)'
            : 'polygon(0% 0%, 90px 0%, 0% 1096px)',
          float: 'left',
          width: 147,
          height: 990,
          marginLeft: -25,
        }}
      />
      {children}
    </inner>
    {noEdge && children}
  </rightSide>
)

const LeftSide = ({ children, inverse, ...props }) => (
  <leftSide
    css={{
      zIndex: 3,
      flex: 1,
      position: 'absolute',
      left: 0,
      right: '50%',
      bottom: 50,
      top: 50,
      paddingRight: 20,
      justifyContent: 'center',
      textAlign: 'right',
    }}
    {...props}
  >
    <inner
      css={{
        display: 'block',
      }}
    >
      <edge
        css={{
          shapeOutside: inverse
            ? 'polygon(82% 0%, 90px 0%, 0% 1096px)'
            : 'polygon(0% 0%, 1px 0%, 96% 1096px)',
          float: 'right',
          width: 110,
          height: 990,
          marginLeft: -25,
        }}
      />
      {children}
    </inner>
  </leftSide>
)

const WavyLine = ({ height, ...props }) => (
  <svg width={60} height={height} {...props}>
    <rect
      style={{ fill: 'url(#wavy-line)' }}
      width={60}
      height={height}
      x="0"
      y="0"
    />
  </svg>
)

const brandColor = UI.color('#4D31CC')

const Cmd = view('span', {
  padding: [2, 5],
  margin: [-2, 0],
  border: [1, '#ccc'],
  borderRadius: 12,
})

const Lines = ({ width = 100, height = 100, style }) => (
  <svg height={height} width={width} style={style} class="pattern-swatch">
    <rect
      style={{ fill: 'url(#diagonal-stripe-3)' }}
      x="0"
      y="0"
      height={height}
      width={width}
    />
  </svg>
)

const Callout = ({ style, ...props }) => (
  <section
    css={{
      border: [5, [255, 255, 255, 0.5]],
      zIndex: 10,
      overflow: 'hidden',
      position: 'relative',
    }}
    style={style}
  >
    <Lines
      width={1000}
      height={2000}
      css={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: -2,
        opacity: 0.025,
        transformOrigin: 'top left',
        transform: {
          scale: 4,
        },
      }}
    />
    <innerSection
      css={{
        margin: 6,
        // borderRadius: 5,
        padding: [30, 32],
        background: '#fff',
        overflow: 'hidden',
        position: 'relative',
      }}
      {...props}
    />
  </section>
)

const P = props => <UI.Text selectable css={{ display: 'block' }} {...props} />
const P2 = props => <P size={2} alpha={0.85} margin={[0, 0, 20]} {...props} />
const Ul = view('span', {
  display: 'inline-block',
  borderBottom: [3, 'rgba(136, 231, 234, 0.9)'],
  marginBottom: -3,
})
const Ul2 = view('span', {
  display: 'inline-block',
  borderBottom: [1, 'dotted', '#ddd'],
  marginBottom: -1,
})
const Hl = view('span', {
  background: UI.color('yellow').alpha(0.8),
  padding: [0, 2],
  margin: [0, -2],
  borderRadius: 3,
  color: '#000',
})

@view
class BrandLogo {
  render() {
    return (
      <brandMark>
        <Logo size={0.32} color={brandColor} />
        <P
          if={false}
          size={1}
          fontWeight={700}
          alpha={0.8}
          css={{ marginTop: 10 }}
        >
          Your cloud, home
        </P>
      </brandMark>
    )
  }

  static style = {
    brandMark: {
      // background: '#fff',
      padding: 20,
      margin: -20,
      alignItems: 'center',
      textAlign: 'center',
    },
  }
}

const altColor = '#D4C042'

@view
class Header {
  render() {
    return (
      <Section>
        <SectionContent padded fullscreen>
          <Slant
            slantBackground={`linear-gradient(200deg, ${Constants.colorSecondary.darken(
              0.15,
            )} 5%, ${Constants.colorSecondary} 95%)`}
          />
          <glowContain
            css={{
              position: 'absolute',
              top: -200,
              left: -100,
              bottom: 0,
              right: '50%',
              zIndex: 1,
              overflow: 'hidden',
              transform: {
                rotate: '5deg',
              },
            }}
          >
            <glow
              css={{
                position: 'absolute',
                top: '42%',
                right: 0,
                marginRight: -100,
                background: Constants.BACKGROUND_ALT.darken(0.2),
                opacity: 0.5,
                width: 350,
                height: 300,
                borderRadius: 100,
                filter: {
                  blur: 150,
                },
              }}
            />
          </glowContain>
          <top $$row>
            <BrandLogo />
            <div $$flex />
          </top>
          <div $$flex />
          <Callout
            css={{
              width: '56%',
              margin: [-80, 0, 0, -50],
            }}
          >
            <Title reduceCapsPct={10} size={5.7} margin={0}>
              Smarter Team Operating System
            </Title>
            <line
              css={{
                margin: [26, 40],
                height: 4,
                background: '#ddd',
                opacity: 0.15,
              }}
            />
            <P size={2} alpha={0.75} margin={[0, 0, 20]}>
              <span if={false} css={{ color: '#000' }} />
              Sort through the cloud and stay in sync.<br />
              Desktop news, search and more.
            </P>
            <P2
              size={1.2}
              fontWeight={700}
              color={brandColor}
              css={{ margin: 0 }}
            >
              <Ul2>Install in just 3 minutes.</Ul2>{' '}
              <AppleLogo
                width={20}
                height={20}
                css={{
                  display: 'inline-block',
                  margin: [-6, 0, 0, 10],
                  opacity: 0.35,
                }}
              />
            </P2>
          </Callout>

          <div $$flex />

          <rightSide>
            <HeaderIllustration />
          </rightSide>
        </SectionContent>
      </Section>
    )
  }

  static style = {
    header: {
      padding: 25,
      position: 'relative',
    },
    top: {
      flexFlow: 'row',
      zIndex: 100,
      position: 'relative',
    },
    brandMark: {
      alignSelf: 'flex-end',
      alignItems: 'center',
      textAlign: 'center',
      marginRight: 20,
    },
    title: {
      fontSize: 40,
    },
    small: {
      fontSize: 14,
      fontWeight: 300,
    },
    rightSide: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 160,
      overflow: 'hidden',
      left: '50%',
      paddingLeft: '5%',
      zIndex: 4,
    },
  }
}

const Notification = ({ title, body }) => (
  <notification
    css={{
      width: 300,
      height: 70,
      background: '#f3f3f3',
      border: [1, '#ddd'],
      padding: 10,
      borderRadius: 7,
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      flexFlow: 'row',
      overflow: 'hidden',
      marginBottom: 20,
    }}
  >
    <MailIcon size={0.09} css={{ margin: [0, 10, 0, 0] }} />
    <content
      css={{
        padding: 3,
        flex: 1,
        overflow: 'hidden',
      }}
    >
      <notTitle css={{ fontWeight: 600 }}>{title}</notTitle>
      <UI.Text ellipse={1}>{body}</UI.Text>
    </content>
  </notification>
)

const Num = view('div', {
  position: 'absolute',
  height: 100,
  width: 100,
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fff',
  border: [1, 'dotted', '#eee'],
  color: '#ccc',
  fontWeight: 100,
  fontSize: 62,
  borderRadius: 1000,
  zIndex: 1,
})

const sleep = ms => new Promise(res => setTimeout(res, ms))

@view
class Section2 extends React.Component {
  state = {
    showOrbit: false,
    showNotifs: true,
    items: [
      {
        title: 'Emily Parker',
        body: 'Book club is cancelled tomorrow',
      },
      {
        title: 'Emily Parker',
        body: 'Book club is cancelled tomorrow',
      },
      {
        title: 'Emily Parker',
        body: 'Book club is cancelled tomorrow',
      },
      {
        title: 'Emily Parker',
        body: 'Book club is cancelled tomorrow',
      },
      {
        title: 'Emily Parker',
        body: 'Book club is cancelled tomorrow',
      },
      {
        title: 'Emily Parker',
        body: 'Book club is cancelled tomorrow',
      },
    ],
  }

  handleIntersect = async ({ isIntersecting }) => {
    console.log('brief intersect', isIntersecting)
    if (!isIntersecting) {
      return
    }
    if (!this.state.showNotifs || this.state.showOrbit) {
      return
    }
    await sleep(1500)
    console.log('hide notifs')
    this.setState({ showNotifs: false })
    await sleep(2000)
    console.log('show orbit')
    this.setState({ showOrbit: true })
  }

  render() {
    const { showOrbit, showNotifs } = this.state

    return (
      <UI.Theme name="light">
        <Section inverse>
          <Num if={false} css={{ left: '50%', marginLeft: -160, top: -100 }}>
            <UI.Icon name="news" />
          </Num>
          <SectionContent padded fullscreen>
            <Slant inverseSlant />
            <LeftSide>
              <Observer onChange={this.handleIntersect}>
                <content css={{ display: 'block', marginTop: 160 }}>
                  <Title size={4}>My Home</Title>
                  <P2
                    size={1.8}
                    css={{
                      marginBottom: 20,
                    }}
                  >
                    Sync up with <Cmd>⌘+Space</Cmd>
                    <span if={false} $noisy>
                      echo chamber<WavyLine height={2900} $line />
                    </span>
                  </P2>
                  <Callout
                    css={{ width: 550, position: 'absolute', right: -30 }}
                  >
                    <P2 size={1.7} css={{ textAlign: 'left' }} margin={0}>
                      You use the best tool for the job. But that can leave your
                      organization <em>a little all over the place</em>.
                      <vertSpace css={{ height: 25 }} />
                      Stay focused by peeking at what's important now. No more
                      notification overload, just well summarized news that's
                      relevant to you.
                      <vertSpace css={{ height: 25 }} />
                      Powered by on-device ML that learns your company
                      vocabulary and what you care about.
                    </P2>
                  </Callout>
                </content>
              </Observer>
            </LeftSide>

            <RightSide
              inverse
              css={{ zIndex: 1, overflow: 'hidden', top: 0, bottom: 0 }}
            >
              <notifications>
                <Trail
                  native
                  from={{ opacity: 1, x: 0 }}
                  config={config.fast}
                  to={{
                    opacity: showNotifs ? 1 : 0,
                    x: showNotifs ? 0 : 100,
                  }}
                  keys={this.state.items.map((_, index) => index)}
                >
                  {this.state.items.map(
                    ({ title, body }) => ({ x, opacity }) => (
                      <animated.div
                        style={{
                          opacity,
                          transform: x.interpolate(
                            x => `translate3d(${x}%,0,0)`,
                          ),
                        }}
                      >
                        <Notification title={title} body={body} />
                      </animated.div>
                    ),
                  )}
                </Trail>
              </notifications>

              <Spring
                if={showOrbit}
                native
                from={{ opacity: 0, x: 100 }}
                to={{ opacity: 1, x: 0 }}
              >
                {({ opacity, x }) => (
                  <animated.div
                    style={{
                      opacity,
                      transform: x
                        ? x.interpolate(x => `translate3d(${x}%,0,0)`)
                        : null,
                    }}
                  >
                    <img
                      src={homeImg}
                      css={{
                        position: 'absolute',
                        top: 140,
                        right: -700,
                        width: 1100,
                        height: 'auto',
                        transformOrigin: 'top left',
                        transform: {
                          scale: 0.5,
                        },
                        boxShadow: [[0, 15, 120, [0, 0, 0, 0.1]]],
                      }}
                    />
                  </animated.div>
                )}
              </Spring>

              <fadeRight
                $$fullscreen
                css={{
                  left: '92%',
                  zIndex: 100,
                  background: `linear-gradient(to right, transparent, ${
                    Constants.backgroundColor
                  })`,
                }}
              />

              <fadeawayfadeawayfadeaway
                css={{
                  position: 'absolute',
                  top: 640,
                  right: -250,
                  width: 900,
                  height: 450,
                  background: Constants.backgroundColor,
                  borderRadius: 1000,
                  filter: {
                    blur: 30,
                  },
                  transform: {
                    z: 0,
                  },
                  zIndex: 2,
                }}
              />

              <secondSection>
                <div css={{ height: 820 }} />
                <content
                  css={{
                    display: 'block',
                    background: Constants.backgroundColor,
                  }}
                >
                  <Title size={3.5}>Smarter Search</Title>
                  <P2 size={1.8} css={{ margin: 0 }}>
                    All your integrations in one place
                  </P2>
                </content>
              </secondSection>
            </RightSide>
          </SectionContent>
        </Section>
      </UI.Theme>
    )
  }

  static style = {
    main: {
      width: 450,
      flex: 1,
    },
    notifications: {
      position: 'absolute',
      top: 200,
      right: 100,
      width: 300,
      bottom: 150,
      zIndex: 1,
    },
    noisy: {
      position: 'relative',
    },
    line: {
      userSelect: 'none',
      fontWeight: 400,
      position: 'absolute',
      bottom: 0,
      left: -3,
      right: 0,
      transformOrigin: 'bottom left',
      transform: {
        scale: 0.1,
        rotate: '90deg',
      },
    },
    secondSection: {
      position: 'relative',
      display: 'block',
      zIndex: 101,
    },
  }
}

@view
class Section3 extends React.Component {
  state = {
    isIntersecting: false,
  }

  handleIntersect = ({ isIntersecting }) => {
    this.setState({ isIntersecting })
  }

  render() {
    const { isIntersecting } = this.state
    console.log('isIntersecting', isIntersecting)
    return (
      <UI.Theme name="light">
        <Section>
          <SectionContent fullscreen padded>
            <Slant css={{ zIndex: 2 }} />
            <LeftSide inverse>
              <div css={{ display: 'block', margin: [360, 0, 0, 30] }}>
                <Title size={4}>Augmented intelligence</Title>
                <P2
                  size={1.8}
                  css={{
                    marginBottom: 15,
                  }}
                >
                  A new way to operate with context
                </P2>
                <Callout css={{ width: 550, position: 'absolute', right: 0 }}>
                  <P2 size={1.6} css={{ textAlign: 'left', margin: 0 }}>
                    All day you're communicating. Whether email, chat, or on
                    projects. Do it smarter by <em>knowing context</em> to what
                    you're doing <em>as you do it</em>.
                    <vertSpace css={{ height: 25 }} />
                    With a simple hold of <Cmd>Option</Cmd> you'll see all
                    important terms, people, and relevant items in your cloud
                    instantly. Orbit even shows you the exact important section
                    without having to type.
                  </P2>
                </Callout>
                <Observer onChange={this.handleIntersect}>
                  <br />
                </Observer>
              </div>
            </LeftSide>
            <RightSide css={{ top: 0, overflow: 'visible' }}>
              <Callout
                css={{ width: 550, position: 'absolute', top: -55, left: 40 }}
              >
                <P2 size={1.6} css={{ textAlign: 'left', margin: 0 }}>
                  It's not just search across the entire cloud, it's incredibly
                  fast, conceptual search that sorts everything from Slack
                  conversations to local files.
                  <vertSpace css={{ height: 25 }} />
                  Get more from your knowledge by putting it at your fingertips.
                </P2>
              </Callout>
            </RightSide>

            <RightSide
              css={{ zIndex: 0, overflow: 'hidden', top: 0, bottom: 0 }}
            >
              <Spring from={{ x: 100 }} to={{ x: 10 }}>
                {({ x }) => (
                  <animated.div
                    style={{
                      transform: `translate3d(${x}px,0,0)`,
                    }}
                  >
                    <img
                      src={wordImage}
                      css={{
                        position: 'absolute',
                        width: 1634,
                        marginLeft: -300,
                        height: 'auto',
                        transformOrigin: 'top left',
                        transform: { scale: 0.35, x: 400, y: 1150 },
                      }}
                    />
                  </animated.div>
                )}
              </Spring>

              <fadeawayfadeawayfadeaway
                css={{
                  position: 'absolute',
                  top: 780,
                  right: -20,
                  width: 800,
                  height: 300,
                  background: Constants.backgroundColor,
                  borderRadius: 1000,
                  filter: {
                    blur: 20,
                  },
                  transform: {
                    z: 0,
                  },
                  zIndex: 2,
                }}
              />
            </RightSide>
          </SectionContent>
        </Section>
      </UI.Theme>
    )
  }
}

@view
class Section4 {
  render() {
    return (
      <UI.Theme name="light">
        <Section inverse>
          <SectionContent fullscreen padded css={{ zIndex: 3 }}>
            <Slant
              inverseSlant
              slantBackground={`linear-gradient(200deg, ${
                Constants.colorSecondary
              } 5%, ${Constants.BACKGROUND_ALT.darken(0.2)} 95%)`}
              css={{ zIndex: 2 }}
            />
            <LeftSide css={{ pointerEvents: 'none' }}>
              <P
                size={1.1}
                fontWeight={800}
                textTransform="uppercase"
                alpha={0.4}
                margin={[120, 0, 10]}
              >
                In Depth
              </P>
              <Title size={3.2}>
                Reducing<br />
                workplace<br />
                interruptions
              </Title>
              <P2 size={1.8} css={{ paddingLeft: 50 }}>
                Orbit focuses on the individual to solve your company clarity.
              </P2>
            </LeftSide>
            <div $$flex />
            <div $$flex />
            <main css={{ paddingLeft: 100, marginTop: 150 }}>
              <P size={1.2} fontWeight={800}>
                Realtime context
              </P>
              <P2 size={1.5}>
                Orbit privately scans any app in a quarter second. Then it
                matches important concepts, projects, and people in your company
                to results in the sidebar.
              </P2>
            </main>
            <Callout
              css={{
                width: 460,
                marginLeft: 120,
                marginTop: 20,
                marginBottom: -30,
              }}
            >
              <P2 size={2} margin={0}>
                Discover someone already started the planning doc or had a Slack
                conversation <em>before</em> you hit send.
              </P2>
            </Callout>
            <RightSide inverse css={{ bottom: 0 }}>
              <div $$flex css={{ marginTop: 300 }} />
              <P size={1.2} fontWeight={800}>
                Automatic Profiles
              </P>
              <P2 size={1.5} css={{ marginRight: 90 }}>
                See which chat rooms people spend time in as well as recent
                things they've done that are relevant to you.
              </P2>
              <Callout css={{ margin: [20, 0, 40, 0], left: -80 }}>
                <div $$row>
                  <P2 size={2} margin={0}>
                    Instead of pinging for the link to a shared document from
                    last week, find it.
                  </P2>
                </div>
              </Callout>
              <br />
              <br />
              <br />
              <content if={false}>
                <P2 size={3}>Make your success team more successful.</P2>
                <P2 size={1.8}>
                  Orbit works alongside Intercom and Zendesk. Your
                  knowledgebase, recently closed tickets and docs now power
                  live, automatic answers as you chat.
                </P2>
              </content>
            </RightSide>
          </SectionContent>
        </Section>
      </UI.Theme>
    )
  }

  static style = {
    main: {
      width: 450,
      flex: 1,
    },
  }
}

@view
class Section6 {
  render() {
    return (
      <UI.Theme name="light">
        <Section>
          <SectionContent fullscreen padded>
            <Slant
              slantBackground={`linear-gradient(200deg, ${Constants.BACKGROUND_ALT.darken(
                0.2,
              )} 5%, ${Constants.BACKGROUND_ALT.darken(0.2).alpha(0.3)} 95%)`}
              css={{ zIndex: 2 }}
            />
            <LeftSide inverse>
              <content
                css={{
                  display: 'block',
                  textAlign: 'right',
                  margin: [150, 0, 100, 40],
                }}
              >
                <P2 size={2.2}>
                  Inspired by solutions like <Ul>Stripe Home</Ul>, we made a
                  beautiful, practical home for your company.
                </P2>
                <Callout
                  if={false}
                  css={{ textAlign: 'left', position: 'absolute', bottom: 50 }}
                >
                  <ul>
                    <li>
                      <UI.Icon $icon name="check" size={20} color="green" />
                      <P size={1.6}>
                        <strong>Heads up</strong>. Unified personal news, minus
                        the noise.
                      </P>
                    </li>
                    <li>
                      <UI.Icon $icon name="check" size={20} color="green" />
                      <P size={1.6}>
                        <strong>Directory</strong>. Beautiful smart profiles of
                        your team.
                      </P>
                    </li>
                    <li>
                      <UI.Icon $icon name="check" size={20} color="green" />
                      <P size={1.6}>
                        <strong>Search</strong> everything: Slack, your files,
                        tickets, and more.
                      </P>
                    </li>
                    <li>
                      <UI.Icon $icon name="check" size={20} color="green" />
                      <P size={1.6}>
                        <strong>Answers</strong>. As you compute, hold{' '}
                        <Cmd>Option</Cmd> to see context in any app.
                      </P>
                    </li>
                  </ul>
                </Callout>
                <P2 if={false} css={{ width: 480 }} textAlign="right">
                  Silicon Valley has finally delivered
                  <span css={{ marginRight: -10 }}>
                    <Ul>a new intranet</Ul>.
                  </span>
                </P2>
              </content>
            </LeftSide>
            <example
              css={{
                position: 'absolute',
                top: 80,
                right: 0,
                bottom: 0,
                left: '50%',
              }}
            >
              <img
                src={personImage}
                width={1490}
                height="auto"
                css={{ transformOrigin: 'top left', transform: { scale: 0.5 } }}
              />
            </example>
          </SectionContent>
        </Section>
      </UI.Theme>
    )
  }

  static style = {
    ul: {
      margin: 0,
      overflow: 'hidden',
    },
    li: {
      display: 'flex',
      flexFlow: 'row',
      alignItems: 'flex-start',
      fontSize: 22,
      padding: [0, 0, 10, 0],
    },
    icon: {
      marginTop: 6,
      marginRight: 12,
    },
  }
}

@view
class Section7 {
  render() {
    return (
      <UI.Theme name="dark">
        <Section css={{ background: '#222' }}>
          <SectionContent fullscreen padded>
            <Slant inverseSlant slantBackground="#111" />
            <LeftSide css={{ textAlign: 'left', marginTop: 220 }}>
              <Title size={5.5}>Secure & Private</Title>
              <br />
              <P2 fontWeight={200} size={2.5}>
                Orbit is completely private. It doesn't send any data outside
                your computer.
              </P2>
              <P2 size={2} fontWeight={200}>
                We realized early in Orbit's development that it's near
                impossible to deliver a great experience without going fully
                on-device. To avoid data privacy issues, permissions errors, and
                complex installations we spent the last year pusing the limits
                of what your desktop can do.
              </P2>

              <br />
              <br />

              <SmallTitle>Our Mission</SmallTitle>
              <P2 size={1.5}>
                Orbit is a personal app that runs intimately in your everyday.
                That means it has to work for you, the individual. Our goal is
                to make computers more reactive to how we work. To do that we
                need trust. So our decisions will always put privacy and
                security first.
              </P2>
            </LeftSide>
            <RightSide noEdge>
              <content css={{ display: 'block', margin: ['auto', 0] }}>
                <PurchaseButton size={1.2}>
                  Free Download for Mac
                </PurchaseButton>
              </content>
            </RightSide>
          </SectionContent>
        </Section>
      </UI.Theme>
    )
  }

  static style = {
    main: {
      width: 400,
      flex: 1,
    },
  }
}

@view
class Footer {
  render() {
    return (
      <Section css={{ padding: 100 }}>
        <SectionContent padded>
          <div $$row>
            <content>
              <P2>Going into beta now</P2>
              <PurchaseButton />
            </content>
            <div $$flex />
            <BrandLogo />
          </div>
        </SectionContent>
      </Section>
    )
  }
}

@view
export default class HomePage extends React.Component {
  render() {
    return (
      <home css={{ background: Constants.backgroundColor }}>
        <Header />
        <surround css={{ position: 'relative' }}>
          <border
            $$fullscreen
            css={{
              borderTop: [4, 'dotted', '#eee'],
              borderBottom: [4, 'dotted', '#eee'],
              width: 'calc(85% + 100px)',
              minWidth: 660,
              maxWidth: Constants.smallSize + 100,
              zIndex: 10000,
              margin: [0, 'auto'],
              alignItems: 'center',
              pointerEvents: 'none',
              // zIndex: -1
            }}
          >
            <borderTitle
              css={{
                marginTop: -20,
                height: 40,
                background: '#fff',
                color: '#000',
                // border: [3, Constants.colorSecondary.darken(0.2)],
                borderTop: 'none',
                borderBottom: 'none',
                padding: [0, 40],
                justifyContent: 'center',
                fontWeight: 800,
                // textTransform: 'titlecase',
                boxShadow: [[0, 5, 40, [0, 0, 0, 0.05]]],
              }}
            >
              <SmallTitle css={{ margin: 0 }}>Your Team OS</SmallTitle>
            </borderTitle>
          </border>
          <Section2 />
          <Section3 />
        </surround>
        <Section4 />
        {/* <Section5 /> */}
        <Section6 />
        <Section7 />
        <Footer />
      </home>
    )
  }
}
