import * as React from 'react'
import { view } from '@mcro/black'
import Logo from '~/views/logo'
import * as UI from '@mcro/ui'
import { Section, SectionContent, Slant, PurchaseButton } from '~/views'
// import homeImg from '~/../public/screen-home.png'
import personImage from '~/../public/screen-person.png'
import wordImage from '~/../public/word.png'
import homeImg from '~/../public/screen-home.png'
import Observer from '@researchgate/react-intersection-observer'
import { Trail, Spring, Keyframes, animated, config } from 'react-spring'
import HeaderIllustration from './headerIllustration'
import { MailIcon } from '~/views/icons'
import * as Constants from '~/constants'

const Animate = {
  Wiggle: view('div', {
    display: 'inline-block',
    // transition: 'all ease-in 100ms',
    transformOrigin: 'top center',
    animation: 'wiggle 5s infinite',
  }),
}

const Title = props => (
  <P
    css={{ fontFamily: '"Mercury Display A", "Mercury Display B"' }}
    // css={{ fontFamily: '"Chronicle Display A", "Chronicle Display B"' }}
    {...props}
  />
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
            : 'polygon(0% 0%, 1px 0%, 85% 1096px)',
          float: 'right',
          width: 110,
          height: 990,
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

const brandColor = UI.color('#5552FA')

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
    //  'linear-gradient(#f2f2f2, #fff)'
    return (
      <Section>
        <SectionContent padded fullscreen>
          <Slant />
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
            <P if={false} size={1.2}>
              <Ul>Customer Success</Ul> &middot; <Ul>No install</Ul> &middot;{' '}
              <Ul>Buy</Ul>
            </P>
          </top>
          <div $$flex />
          <Callout
            css={{
              width: '56%',
              margin: [-80, 0, 0, -50],
            }}
          >
            <Title size={4.5} margin={[8, 0, 5]} fontWeight={600}>
              An operating system for your company
            </Title>
            <line
              css={{
                margin: [26, 40],
                height: 4,
                background: '#ddd',
                opacity: 0.15,
              }}
            />
            <P size={2} alpha={0.75} margin={[0, 0, 10]}>
              <span if={false} css={{ color: '#000' }} />
              Make it easy to understand what's going on with a brain for your
              team.
            </P>
            <P size={1.3} alpha={0.7}>
              <Ul2>News</Ul2>, <Ul2>search</Ul2> and <Ul2>context</Ul2>{' '}
              installed in 3 minutes.
            </P>
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
        <Section leftBackground="transparent" inverse>
          <Num if={false} css={{ left: '50%', marginLeft: -160, top: -100 }}>
            <UI.Icon name="news" />
          </Num>
          <SectionContent padded fullscreen>
            <Slant inverseSlant />
            <LeftSide>
              <Observer onChange={this.handleIntersect}>
                <content css={{ display: 'block', marginTop: 140 }}>
                  <Title size={3} fontWeight={800} margin={[0, 0, 10]}>
                    Company News
                  </Title>
                  <P2
                    size={2}
                    css={{
                      overflow: 'hidden',
                      marginBottom: 15,
                    }}
                  >
                    Turn down the noise
                    <span if={false} $noisy>
                      echo chamber<WavyLine height={2900} $line />
                    </span>
                  </P2>
                  <Callout
                    css={{ width: 500, position: 'absolute', right: -60 }}
                  >
                    <P2 size={1.6} css={{ textAlign: 'left' }}>
                      You use the best tool for the job. But that can leave your
                      company feeling <em>a little all over the place</em>.
                      <br />
                      <br />
                      Keep everyone on the same page with company-wide news,
                      generated using custom on-device machine learning focused
                      on making your day run smoothly.
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
                        top: 240,
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
                  top: 580,
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
                <div css={{ height: 810 }} />
                <content
                  css={{
                    display: 'block',
                    background: Constants.backgroundColor,
                  }}
                >
                  <SmallTitle if={false}>Search</SmallTitle>
                  <P size={3} fontWeight={800} margin={[0, 0, 10]}>
                    Search that works
                  </P>
                  <P2
                    size={2}
                    css={{
                      overflow: 'hidden',
                      marginBottom: 15,
                    }}
                  >
                    Natural language cloud search
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
              <div css={{ display: 'block', margin: [380, 0, 0, 30] }}>
                <P size={3} fontWeight={800} margin={[0, 0, 10]}>
                  Knowledge at hand
                </P>
                <P2
                  size={2}
                  css={{
                    overflow: 'hidden',
                    marginBottom: 15,
                  }}
                >
                  Intelligent contextual search
                </P2>
                <Callout css={{ width: 480, position: 'absolute', right: 0 }}>
                  <P2 size={1.6} css={{ textAlign: 'left' }}>
                    Here's something you do every day: write emails and talk
                    with clients. But do you double check there wasn't a
                    relevant conversation, ticket, or previous before you every
                    send?
                    <br />
                    <br />
                    Orbit uses on-device OCR that scans any app instantly and
                    powers realtime results.
                  </P2>
                </Callout>
                <Observer onChange={this.handleIntersect}>
                  <br />
                </Observer>
              </div>
            </LeftSide>
            <RightSide css={{ zIndex: 0, overflow: 'hidden' }}>
              <Callout css={{ width: 480 }}>
                <P2 size={1.6} css={{ textAlign: 'left' }}>
                  searhc lorems
                </P2>
              </Callout>

              <Spring from={{ x: 100 }} to={{ x: 0 }}>
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
                        marginLeft: -500,
                        height: 'auto',
                        transformOrigin: 'center left',
                        transform: { scale: 0.35, x: 400, y: 200 },
                      }}
                    />
                  </animated.div>
                )}
              </Spring>
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
            <LeftSide>
              <P
                size={1.1}
                fontWeight={800}
                textTransform="uppercase"
                alpha={0.4}
              >
                In Depth
              </P>
              <P2 size={3}>Reducing workplace interruptions</P2>
              <P2 size={2.1}>
                Orbit takes a unique approach to making your company clear and
                distraction-free.
              </P2>
            </LeftSide>
            <div $$flex />
            <div $$flex />
            <main css={{ paddingLeft: 60 }}>
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
              <P2 size={2.2} margin={0}>
                Discover someone already started the planning doc or had a Slack
                conversation <em>before</em> you hit send.
              </P2>
            </Callout>
            <RightSide inverse css={{ bottom: 0 }}>
              <div $$flex css={{ marginTop: 140 }} />
              <P size={1.2} fontWeight={800}>
                Automatic Profiles
              </P>
              <P2 size={1.5} css={{ marginRight: 90 }}>
                See which chat rooms people spend time in as well as recent
                things they've done that are relevant to you.
              </P2>
              <Callout css={{ margin: [20, 0, 40, 0], left: -80 }}>
                <div $$row>
                  <P2 size={2.2} margin={0}>
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
              slantBackground={Constants.BACKGROUND_ALT.darken(0.2)}
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
                <P size={2.5} fontWeight={800}>
                  A sense of unity
                </P>
                <br />
                <br />
                <P2 size={2.2}>
                  Inspired by solutions like <Ul>Stripe Home</Ul>, we made a
                  beautiful, practical home for your company.
                </P2>
                <br />
                <Callout
                  css={{ textAlign: 'left', position: 'absolute', bottom: 50 }}
                >
                  <P size={1.2} fontWeight={700}>
                    Features
                  </P>
                  <br />
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
              <P size={3} fontWeight={800}>
                Secure & Private
              </P>
              <br />
              <P2 fontWeight={200} size={2.2}>
                Orbit is completely private and doesn't sync any data to the
                cloud.
              </P2>
              <P2 size={1.5}>
                We realized early in Orbit's development that it's near
                impossible to deliver a great experience without going fully
                on-device. We wanted to avoid data privacy issues, permissions
                errors, and complex, expensive installations.
              </P2>
              <P2 size={1.5} />
              <P2 size={1.5}>
                For the last year we've been testing and pusing the limits of
                what your desktop can do given those constraints. We think we
                have the tech figured out.
              </P2>
              <P2 size={1.5}>
                But more importantly, because Orbit is a <Ul>personal app,</Ul>{' '}
                it's focus it entirely on person using it. We believe strongly
                that the only way Orbit survives is by making the individual
                experience as good as possible.
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
              border: [2, 'dotted', '#f2f2f2'],
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
                boxShadow: [[0, 0, 80, [0, 0, 0, 0.1]]],
              }}
            >
              <SmallTitle css={{ margin: 0 }}>How Orbit Works</SmallTitle>
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
