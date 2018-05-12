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
import { Trail, Spring, animated } from 'react-spring'
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

const SmallTitle = props => (
  <P
    size={1.1}
    fontWeight={800}
    textTransform="uppercase"
    alpha={0.5}
    margin={[0, 0, 10]}
    {...props}
  />
)

const RightSide = ({ children, inverse, ...props }) => (
  <rightSide
    css={{
      zIndex: 3,
      flex: 1,
      position: 'absolute',
      left: '50%',
      right: 0,
      bottom: 90,
      top: 90,
      paddingRight: 20,
      justifyContent: 'center',
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
            ? 'polygon(26% 0%, 0% 74px, 120% 1096px)'
            : 'polygon(0% 0%, 90px 0%, 0% 1096px)',
          float: 'left',
          width: 110,
          height: 990,
        }}
      />
      {children}
    </inner>
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
    }}
    {...props}
  >
    <inner
      css={{
        display: 'block',
        textAlign: 'right',
      }}
    >
      <edge
        css={{
          shapeOutside: inverse
            ? 'polygon(82% 0%, 90px 0%, 0% 1096px)'
            : 'polygon(0% 0%, 90px 0%, 94% 1096px)',
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
      background: '#fff',
      border: [10, '#fff'],
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
        opacity: 0.04,
        transformOrigin: 'top left',
        transform: {
          scale: 3,
        },
      }}
    />
    <innerSection
      css={{
        margin: 8,
        // borderRadius: 5,
        padding: 30,
        background: '#fff',
        overflow: 'hidden',
        position: 'relative',
      }}
      {...props}
    />
  </section>
)

const P = props => <UI.Text selectable css={{ display: 'block' }} {...props} />
const P2 = props => <P size={2} alpha={0.8} margin={[0, 0, 20]} {...props} />
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
const Hl = view('span', { background: 'yellow' })

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

@view
class Header {
  render() {
    //  'linear-gradient(#f2f2f2, #fff)'
    return (
      <Section leftBackground={Constants.BACKGROUND_ALT}>
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
            <P size={1.2}>
              <Ul>Customer Success</Ul> &middot; <Ul>No install</Ul> &middot;{' '}
              <Ul>Buy</Ul>
            </P>
          </top>
          <div $$flex />
          <Callout css={{ width: '52%', margin: [-80, 0, 0, -50] }}>
            <P
              size={2.1}
              fontWeight={700}
              color={brandColor.darken(0.2)}
              marginBottom={-5}
            >
              Your company is growing
            </P>
            <P size={4.3} margin={[15, 0, 10]} fontWeight={500}>
              Make it easy to understand what's going on.
            </P>
            <line
              if={false}
              css={{ margin: [15, 40], height: 3, background: '#f2f2f2' }}
            />
            <P size={2} alpha={0.75} margin={[5, 0, 25]}>
              <span if={false} css={{ color: '#000' }} />
              Upgrade your Mac with intelligence.<br />
              Your company cloud meets your OS.
            </P>
            <P size={1.2} alpha={0.7}>
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
    main: {
      width: 625,
      background: '#fff',
      border: [3, '#f2f2f2'],
      zIndex: 10,
      padding: 40,
      margin: -40,
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

@view
class Section2 extends React.Component {
  state = {
    showOrbit: false,
    showNotifs: false,
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

  handleIntersect = ({ isIntersecting }) => {
    console.log('NOTIFS INTERS', isIntersecting)
    if (!isIntersecting) {
      return
    }
    if (this.state.showNotifs) {
      return
    }
    setTimeout(() => {
      this.setState({ showNotifs: true })
    }, 500)
    setTimeout(() => {
      this.setState({ showNotifs: false })
    }, 2500)
    setTimeout(() => {
      this.setState({ showOrbit: true })
    }, 3000)
  }

  render() {
    return (
      <UI.Theme name="light">
        <Section leftBackground={Constants.BACKGROUND_ALT} inverse>
          <Num if={false} css={{ left: '50%', marginLeft: -160, top: -100 }}>
            <UI.Icon name="news" />
          </Num>
          <SectionContent padded fullscreen>
            <Slant inverseSlant />
            <LeftSide>
              <Observer onChange={this.handleIntersect}>
                <content css={{ display: 'block', marginTop: 80 }}>
                  <SmallTitle>News</SmallTitle>
                  <P size={3} fontWeight={800} margin={[0, 0, 35]}>
                    Slack can be an<br />
                    <span $noisy>
                      echo chamber<WavyLine height={2900} $line />
                    </span>
                  </P>
                  <P2 size={1.6}>
                    Turn off notifications & stay up to date.<br />
                    Your cloud meets <Cmd>⌘+Space</Cmd>.
                    <br />
                    With on-device <Ul2>machine learning</Ul2>.
                  </P2>
                  <br />
                  <br />
                  <quote
                    if={false}
                    css={{
                      width: 500,
                      // margin: [-20, 0, 0],
                      // alignItems: 'flex-end',
                      textAlign: 'right',
                    }}
                  >
                    <P size={3.5} fontWeight={200} alpha={0.5}>
                      Pull,<br />
                      <span css={{ marginRight: -4 }}>instead of</span>
                      <br />
                      <span css={{ marginRight: -8 }}>being pushed</span>
                    </P>
                  </quote>
                </content>
              </Observer>
            </LeftSide>

            <newsIllustration>
              <Trail
                native
                from={{ opacity: 0, x: 100 }}
                to={{
                  opacity: this.state.showNotifs ? 1 : 0,
                  x: this.state.showNotifs ? 0 : 100,
                }}
                keys={this.state.items.map((_, index) => index)}
              >
                {this.state.items.map(({ title, body }) => ({ x, opacity }) => (
                  <animated.div
                    style={{
                      opacity,
                      transform: x.interpolate(x => `translate3d(${x}%,0,0)`),
                    }}
                  >
                    <Notification title={title} body={body} />
                  </animated.div>
                ))}
              </Trail>

              <img
                src={homeImg}
                css={{
                  position: 'absolute',
                  top: 10,
                  width: 1100,
                  height: 'auto',
                  transformOrigin: 'top left',
                  transform: {
                    scale: 0.5,
                  },
                  boxShadow: [[0, 0, 100, [0, 0, 0, 0.1]]],
                }}
              />
            </newsIllustration>

            <fadeawayfadeawayfadeaway
              css={{
                position: 'absolute',
                top: 350,
                right: -250,
                width: 900,
                height: 500,
                background: '#fff',
                borderRadius: 1000,
                filter: {
                  blur: 80,
                },
                transform: {
                  z: 0,
                },
                zIndex: 2,
              }}
            />

            <RightSide inverse css={{ zIndex: 10000000000 }}>
              <div css={{ height: 610 }} />
              <SmallTitle>Search</SmallTitle>
              <P size={3} fontWeight={800} margin={[0, 0, 20]}>
                Search that works
              </P>
              <P2 size={2.2}>
                Like Spotlight that searches Gmail, Slack, Jira, GDocs,
                Dropbox...
              </P2>
              <P2 size={1.6} margin={0}>
                Completely private and on-device.<br />
                Powered by state of the art <Ul2>NLP</Ul2>.
              </P2>
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
    newsIllustration: {
      position: 'absolute',
      top: 20,
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
        <Section leftBackground={Constants.BACKGROUND_ALT}>
          <SectionContent fullscreen padded>
            <Slant css={{ zIndex: 2 }} />
            <LeftSide inverse>
              <div css={{ marginTop: 300 }} />
              <SmallTitle>Context</SmallTitle>
              <P size={3} fontWeight={800} margin={[0, 0, 20]}>
                Context without context-switching
              </P>
              <P2 size={2.2}>
                The <Cmd>Option</Cmd> key upgrades.
              </P2>
              <P2 size={1.6}>
                Writing an important email or doc?<br />
                See updates on projects and people.<br />
                Powered by realtime <Ul2>OCR</Ul2>.
              </P2>
              <Observer onChange={this.handleIntersect}>
                <br />
              </Observer>
              <br />
              <Callout if={false}>
                <P fontWeight={600} size={1.4} margin={[-5, 0, 5]}>
                  Give it a try
                </P>
                <P2 size={2} color={brandColor} margin={0}>
                  Hold{' '}
                  <Animate.Wiggle>
                    <Cmd>Option</Cmd>
                  </Animate.Wiggle>{' '}
                  to see context.
                </P2>
              </Callout>
            </LeftSide>
            <RightSide css={{ zIndex: 0, overflow: 'hidden' }}>
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
                        width: 1634,
                        marginLeft: -500,
                        height: 'auto',
                        transformOrigin: 'center left',
                        transform: { scale: 0.35, x: 400 },
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
        <Section inverse leftBackground={Constants.BACKGROUND_ALT}>
          <SectionContent fullscreen padded css={{ zIndex: 3 }}>
            <Slant
              inverseSlant
              slantBackground={`linear-gradient(200deg, ${
                Constants.colorSecondary
              } 5%, ${Constants.BACKGROUND_ALT.darken(0.2)} 95%)`}
              css={{ zIndex: 2 }}
            />
            <main css={{ marginTop: -50 }}>
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
            </main>
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
                marginLeft: 80,
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
              <Callout css={{ margin: [20, 0, 40, 0], left: -60 }}>
                <div $$row>
                  <P2 size={2.2} margin={0}>
                    Less pinging someone because you can't find the link to a
                    shared document from last week.
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
        <Section leftBackground={Constants.BACKGROUND_ALT}>
          <SectionContent fullscreen padded>
            <Slant
              slantBackground={Constants.BACKGROUND_ALT.darken(0.2)}
              css={{ zIndex: 2 }}
            />
            <main>
              <P size={2.5} fontWeight={800}>
                A sense of unity.
              </P>
              <br />
              <br />
              <P2 size={2.2}>
                Inspired by solutions like <Ul>Stripe Home</Ul>, we made a
                beautiful, practical home for your company.
              </P2>
              <br />
              <P size={1.2} fontWeight={700}>
                Features
              </P>
              <br />
              <ul>
                <li>
                  <UI.Icon $icon name="check" size={20} color="green" />
                  <P size={1.6}>
                    <strong>Heads up</strong>. Unified personal news, minus the
                    noise.
                  </P>
                </li>
                <li>
                  <UI.Icon $icon name="check" size={20} color="green" />
                  <P size={1.6}>
                    <strong>Directory</strong>. Beautiful smart profiles of your
                    team.
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
              <br />
              <div $$flex />
            </main>
            <P2 css={{ width: 480 }} textAlign="right">
              Silicon Valley has finally delivered
              <span css={{ marginRight: -10 }}>
                <Ul>a new intranet</Ul>.
              </span>
            </P2>
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
    main: {
      width: 480,
      flex: 1,
    },
    ul: {
      margin: 0,
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
            <Slant
              inverseSlant
              slantBackground={`linear-gradient(200deg, ${Constants.BACKGROUND_ALT.darken(
                0.2,
              )} 5%, #111)`}
            />
            <main>
              <P size={3} fontWeight={800}>
                Private. Secure.<br />
                No installation.
              </P>
              <br />
              <main>
                <P2 fontWeight={200} size={2.5}>
                  Orbit has no cloud and no on-prem install. It's a desktop app
                  that's your <em>personal assistant</em> for solving{' '}
                  <em>company problems</em>.
                </P2>
                <br />
                <P2 size={1.5}>
                  We realized early in Orbit's development that it's near
                  impossible to deliver a great experience without going fully
                  on-device.
                </P2>
                <P2 size={1.5}>
                  From permissions issues to data privacy to complex to
                  expensive installation processess, on-device was the only way
                  to go.
                </P2>
                <P2 size={1.5}>
                  For the last year we've been pushing the limits of what your
                  desktop can do. That's what makes Orbit unique.
                </P2>
                <P2 size={1.5}>
                  It's made for you. Privacy first & passionate about making
                  your knowledge work for you.
                </P2>
              </main>
            </main>
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
      <home>
        <Header />
        <Section2 />
        <Section3 />
        <Section4 />
        {/* <Section5 /> */}
        <Section6 />
        <Section7 />
        <Footer />
      </home>
    )
  }
}
