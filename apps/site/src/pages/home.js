import * as React from 'react'
import { view } from '@mcro/black'
import Logo from '~/views/logo'
import * as UI from '@mcro/ui'
import * as V from '~/views'
// import homeImg from '~/../public/screen-home.png'
import contextImg from '~/../public/screen-context.png'
import personImage from '~/../public/screen-person.png'
import wordImage from '~/../public/word.png'
import Observer from '@researchgate/react-intersection-observer'
import { Spring, animated } from 'react-spring'
import Trail from '~/trail'
import HeaderIllustration from './headerIllustration'
import { MailIcon } from '~/views/icons'

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
  padding: [3, 5],
  margin: [-3, 0],
  border: [1, '#555'],
  borderRadius: 10,
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

const PurchaseButton = props => (
  <UI.Button
    background="#fff"
    color="green"
    borderColor="green"
    borderWidth={2}
    size={1.1}
    fontWeight={300}
    {...props}
  >
    <span css={{ fontWeight: 500 }}>Early access</span> &nbsp;&middot;&nbsp;{' '}
    <span css={{ fontWeight: 800 }}>$200</span>
  </UI.Button>
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
      css={{ margin: 8, borderRadius: 10, padding: 40, background: '#fff' }}
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

@view
class BrandLogo {
  render() {
    return (
      <brandMark>
        <Logo size={0.38} color={brandColor} />
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
      <V.Section css={{ background: '#fff' }}>
        <V.SectionContent padded fullscreen>
          <V.Slant rightBackground="#fff" />
          <glowContain
            css={{
              position: 'absolute',
              top: -200,
              left: 0,
              bottom: 0,
              right: '50%',
              zIndex: 0,
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
                background: '#CCCEF1',
                width: 400,
                height: 350,
                borderRadius: 100,
                opacity: 0.7,
                filter: {
                  blur: 150,
                },
              }}
            />
          </glowContain>
          <bgTest
            css={{
              position: 'absolute',
              top: -500,
              left: -500,
              bottom: -500,
              right: '50%',
              zIndex: -2,
              background: '#fff',
              transform: {
                rotate: '5deg',
              },
            }}
          />
          <top $$row>
            <BrandLogo />
            <div $$flex />
            <P size={1.2}>
              <Ul>Customer Success</Ul> &middot; <Ul>No install</Ul> &middot;{' '}
              <Ul>Buy</Ul>
            </P>
          </top>
          <div $$flex />
          <Callout css={{ width: '57%', margin: [-80, 0, 0, -34] }}>
            <P size={1.9} fontWeight={800} color={'#000' || brandColor}>
              Your company is growing
            </P>
            <P size={4.3} margin={[15, 0, 10]} fontWeight={300}>
              Make it easy to understand what's going on.
            </P>
            <line
              if={false}
              css={{ margin: [15, 40], height: 3, background: '#f2f2f2' }}
            />
            <P size={2} alpha={0.75} margin={[5, 0, 25]}>
              <span if={false} css={{ color: '#000' }}>
                A cloudless solution to organizing your cloud.
              </span>{' '}
              Company news, search and more, right on your OS. 3 minute install.
            </P>
          </Callout>

          <div $$flex />

          <rightSide>
            <HeaderIllustration />
          </rightSide>
        </V.SectionContent>
      </V.Section>
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
      bottom: 0,
      left: '60%',
      zIndex: 2,
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
        <V.Section>
          <V.SectionContent padded fullscreen>
            <V.Slant inverseSlant />
            <bgTest
              if={false}
              css={{
                position: 'absolute',
                top: -500,
                left: -500,
                bottom: -500,
                right: '48%',
                zIndex: -2,
                background: '#fff',
                transform: {
                  rotate: '-5deg',
                },
              }}
            />
            <UI.Theme name="light">
              <Observer onChange={this.handleIntersect}>
                <main css={{ marginTop: -20 }}>
                  <P fontWeight={600} size={4} margin={[0, 0, 25]}>
                    Slack works,<br /> but there's too much{' '}
                    <span $noisy>
                      noise<WavyLine height={1400} $line />
                    </span>
                  </P>
                  <P2 size={2.2}>
                    Step one: unify your integrations native to your Mac.
                  </P2>
                  <P size={2}>
                    Step two: generate a daily heads up that's targeted to you.
                  </P>
                  <br />
                  <P size={1.8}>
                    Orbit simplifies your company organization, removing the
                    noise. That means more time focusing and less interruptions.
                  </P>
                  <br />
                  <P size={1.8}>
                    It works by upgrading spotlight with beautiful daily news on
                    your <Cmd>⌘+Space</Cmd>.
                  </P>
                  <div $$flex />
                </main>
              </Observer>
              <rightSection
                css={{
                  width: 500,
                  // margin: [0, 0, -20],
                  alignItems: 'flex-end',
                  textAlign: 'right',
                }}
              >
                <P size={4} fontWeight={200} color={brandColor}>
                  pull,<br />
                  <span css={{ marginRight: -5 }}>instead of</span>
                  <br />
                  <span css={{ marginRight: -10 }}>getting pushed</span>
                </P>
                <P if={false} size={2}>
                  Give it a pull&nbsp; 👈
                </P>
                <br />
                <br />
              </rightSection>
            </UI.Theme>
            <notifications>
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

              <div $$flex />
              <div $$flex />

              <UI.Button
                if={false}
                size={1.2}
                borderColor="#000"
                borderWidth={1}
                css={{ marginLeft: -50, width: 'auto' }}
              >
                👈 Give it a pull
              </UI.Button>

              <div $$flex />
              <div $$flex />
            </notifications>
          </V.SectionContent>
        </V.Section>
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
      right: -20,
      width: 300,
      bottom: 100,
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
        <V.Section css={{ background: '#fff' }}>
          <V.SectionContent fullscreen padded>
            <V.Slant css={{ zIndex: 2 }} />
            <Observer onChange={this.handleIntersect}>
              <leftSide css={{ width: '50%', zIndex: 0, overflow: 'hidden' }}>
                <Spring from={{ x: 0 }} to={{ x: 100 }}>
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
                          height: 'auto',
                          transformOrigin: 'top left',
                          transform: { scale: 0.45, x: 250 },
                        }}
                      />
                    </animated.div>
                  )}
                </Spring>
              </leftSide>
            </Observer>
            <rightSide>
              <inner>
                <edge
                  css={{
                    shapeOutside: 'polygon(0% 0%, 90px 0%, 0% 1096px)',
                    float: 'left',
                    width: 110,
                    height: 720,
                  }}
                />
                <P size={3} fontWeight={800}>
                  Everywhere it matters.
                </P>
                <br />
                <P2 size={2.2}>
                  Your company knowledge should augment how you work. In order
                  to truly upgrade your team, we integrated it with everything
                  you do.
                </P2>
                <br />
                <P2 size={1.8}>
                  Whether writing an email or chatting with a customer, a tap of
                  a button lets you see contextually relevant answers in
                  realtime.
                </P2>
                <br />
                <br />
                <Callout>
                  <P2 size={2} color={brandColor}>
                    <strong>Demo:</strong> hold <Cmd>Option</Cmd> now.
                  </P2>
                </Callout>
              </inner>
            </rightSide>
          </V.SectionContent>
        </V.Section>
      </UI.Theme>
    )
  }

  static style = {
    rightSide: {
      zIndex: 3,
      flex: 1,
      position: 'absolute',
      left: '50%',
      right: 0,
      bottom: 90,
      paddingRight: 30,
    },
    inner: {
      alignSelf: 'center',
      display: 'block',
    },
  }
}

@view
class Section4 {
  render() {
    return (
      <UI.Theme name="medium">
        <V.Section css={{ background: '#fafafa' }}>
          <V.SectionContent fullscreen padded>
            <V.Slant
              inverseSlant
              backgroundColor="#f0f0f0"
              css={{ zIndex: 2 }}
            />
            <main>
              <P size={1.2} fontWeight={800}>
                Use case #1
              </P>
              <P2 size={3}>Reduce workplace interruptions instantly.</P2>
              <P2 size={1.8}>
                Whether alongside Intercom or Slack, all of your cloud from
                knowledgebase information to recently closed tickets power live,
                automatic answers as you chat. See the{' '}
                <Ul2>exact answer highlighted</Ul2> without typing a thing.
              </P2>
            </main>
            <br />
            <div $$flex />
            <div $$flex />
            <div $$flex />
            <Callout css={{ width: 460, marginLeft: 80 }}>
              <P size={1.2} fontWeight={800}>
                The Result
              </P>
              <P2 size={2.2} margin={0}>
                Reduced onboarding time. Less interruptions over small
                questions.
              </P2>
            </Callout>
            <div $$flex />
            <illustration>
              <img
                src={contextImg}
                css={{
                  width: 550,
                  height: 'auto',
                  position: 'absolute',
                  top: 125,
                  right: -78,
                  zIndex: 0,
                }}
              />
            </illustration>
          </V.SectionContent>
        </V.Section>
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
class Section5 {
  render() {
    return (
      <UI.Theme name="medium">
        <V.Section css={{ background: '#fafafa' }}>
          <V.SectionContent fullscreen padded>
            <V.Slant backgroundColor="#f0f0f0" css={{ zIndex: 2 }} />
            <leftSide css={{ width: '50%', zIndex: 0, overflow: 'hidden' }}>
              <leftInner>
                <img
                  src={wordImage}
                  css={{
                    width: 1634,
                    height: 'auto',
                    transformOrigin: 'top left',
                    transform: { scale: 0.45, x: 250 },
                  }}
                />
              </leftInner>
            </leftSide>
            <rightSide>
              <inner>
                <edge
                  css={{
                    shapeOutside: 'polygon(0% 0%, 90px 0%, 0% 1096px)',
                    float: 'left',
                    width: 110,
                    height: 720,
                  }}
                />
                <P size={1.2} fontWeight={800}>
                  Use case #2
                </P>
                <P2 size={3}>Make your success team more successful.</P2>
                <P2 size={1.8}>
                  Orbit works alongside Intercom and Zendesk. Your
                  knowledgebase, recently closed tickets and docs now power
                  live, automatic answers as you chat.
                  <br />
                  <br />
                  See the <Ul2>exact answer highlighted</Ul2> without typing a
                  thing.
                </P2>
                <br />
                <br />
                <br />
                <Callout css={{ width: 460, left: -80 }}>
                  <P size={1.2} fontWeight={800}>
                    The Result
                  </P>
                  <P2 size={2.2} margin={0}>
                    Reduced onboarding time. Less interruptions over small
                    questions.
                  </P2>
                </Callout>
              </inner>
            </rightSide>
          </V.SectionContent>
        </V.Section>
      </UI.Theme>
    )
  }

  static style = {
    rightSide: {
      zIndex: 3,
      flex: 1,
      position: 'absolute',
      left: '51%',
      right: 0,
      bottom: 100,
    },
    inner: {
      // alignSelf: 'center',
      display: 'block',
    },
  }
}

@view
class Section6 {
  render() {
    return (
      <UI.Theme name="light">
        <V.Section css={{ background: '#fff' }}>
          <V.SectionContent fullscreen padded>
            <V.Slant
              // backgroundColor="#f2f2f2"
              inverseSlant
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
          </V.SectionContent>
        </V.Section>
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

const Ul2 = view('span', { background: 'yellow' })

@view
class Section7 {
  render() {
    return (
      <UI.Theme name="dark">
        <V.Section css={{ background: '#222' }}>
          <V.SectionContent fullscreen padded>
            <V.Slant backgroundColor="#000" />
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
          </V.SectionContent>
        </V.Section>
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
      <V.Section css={{ padding: 100 }}>
        <V.SectionContent padded>
          <div $$row>
            <content>
              <P2>Going into beta now</P2>
              <PurchaseButton />
            </content>
            <div $$flex />
            <BrandLogo />
          </div>
        </V.SectionContent>
      </V.Section>
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
        <Section5 />
        <Section6 />
        <Section7 />
        <Footer />
      </home>
    )
  }
}
