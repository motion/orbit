import * as React from 'react'
import { view } from '@mcro/black'
import Logo from '~/views/logo'
import * as UI from '@mcro/ui'
import * as V from '~/views'
// import homeImg from '~/../public/screen-home.png'
import contextImg from '~/../public/screen-context.png'
import slackIcon from '~/../public/slack.svg'
import driveIcon from '~/../public/drive.svg'
import dropboxIcon from '~/../public/dropbox.svg'
import mailIcon from '~/../public/mail.svg'
import githubIcon from '~/../public/github.svg'
import personImage from '~/../public/screen-person.png'
import SVGInline from 'react-svg-inline'
import Observer from '@researchgate/react-intersection-observer'
import { Trail, animated } from 'react-spring'

// <linesContain
//               if={false}
//               css={{
//                 position: 'absolute',
//                 top: -200,
//                 left: '50%',
//                 right: '-50%',
//                 bottom: 0,
//                 overflow: 'hidden',
//                 zIndex: -2,
//                 transform: { rotate: '-5deg' },
//               }}
//             >
//               <Lines
//                 width={1000}
//                 height={2000}
//                 css={{
//                   position: 'absolute',
//                   top: 0,
//                   right: 0,
//                   bottom: 0,
//                   left: 0,
//                   overflow: 'hidden',
//                   marginLeft: 100,
//                   opacity: 0.02,
//                   // display: 'none',
//                   transformOrigin: 'top left',
//                   transform: {
//                     rotate: '10deg',
//                     x: '-12.8%',
//                     scale: 3,
//                   },
//                 }}
//               />
//             </linesContain>

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

const Icon = ({ size, icon, scale = 1, after, transform, ...props }) => (
  <slackIcon
    css={{ position: 'relative', width: size * 512, height: size * 512 }}
  >
    <SVGInline
      cleanup
      svg={icon}
      width="512"
      height="512"
      css={{
        transformOrigin: 'top left',
        transform: { scale: size * scale, ...transform },
      }}
      {...props}
    />
    {after}
  </slackIcon>
)

const SlackIcon = props => <Icon {...props} icon={slackIcon} />
const DriveIcon = props => <Icon {...props} scale={1.8} icon={driveIcon} />
const DropboxIcon = props => <Icon {...props} icon={dropboxIcon} />
const GithubIcon = props => <Icon {...props} icon={githubIcon} />
const MailIcon = props => (
  <Icon {...props} scale={4} transform={{ x: -15 }} icon={mailIcon} />
)

const brandColor = '#5552FA'

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
      width: '57%',
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
      css={{ margin: 10, borderRadius: 10, padding: 40, background: '#fff' }}
      {...props}
    />
  </section>
)

const Triangle = ({
  size = 1,
  background = 'transparent',
  borderColor = '#000',
  borderWidth = 10,
  style,
}) => {
  const width = 350 * size
  const height = 450 * size
  return (
    <svg height={height} width={width + borderWidth} style={style}>
      <polygon
        points="225,10 100,210 350,210"
        style={{
          fill: background,
          stroke: borderColor,
          strokeWidth: borderWidth / size,
          transform: `scale(${size})`,
          transformOrigin: 'top left',
        }}
      />
    </svg>
  )
}

const P = props => <UI.Text selectable {...props} />
const P2 = props => <P size={2} alpha={0.8} margin={[0, 0, 20]} {...props} />
const Ul = view('span', {
  display: 'inline-block',
  borderBottom: [4, 'rgba(136, 231, 234, 0.9)'],
  marginBottom: -4,
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
    const chats = [
      <bubble $left>The #general chat room</bubble>,
      <bubble>About as coherent as an acid trip</bubble>,
      <bubble $left>🙄</bubble>,
      <bubble>Spreading like an oil spill...</bubble>,
      <bubble $left>Clear as modern art 🖌</bubble>,
    ]

    return (
      <V.Section>
        <V.SectionContent padded fullscreen>
          <V.Slant />
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
            <PurchaseButton />
          </top>
          <div $$flex />
          <Callout css={{ margin: [-80, -34, 0] }}>
            <P size={2} fontWeight={800} color={brandColor}>
              Your company is growing
            </P>
            <P size={4.3} margin={[15, 0, 10]} fontWeight={300}>
              Make it easy to understand what's going on.
            </P>
            <P size={2} alpha={0.75} margin={[10, 0, 25]}>
              <span css={{ color: '#000' }}>
                Important things are happening and getting lost in the noise.
              </span>{' '}
              Organize your team and cloud by upgrading your operating system.
            </P>
          </Callout>
          <div $$flex />

          <chats>
            <Trail
              native
              from={{ opacity: 0, y: 20 }}
              to={{ opacity: 1, y: 0 }}
              keys={chats.map((_, index) => index)}
              config={{ tension: 480, friction: 60 }}
            >
              {chats.map(item => ({ y, opacity }) => (
                <animated.div
                  style={{
                    opacity,
                    transform: y.interpolate(y => `translate3d(0,${y}%,0)`),
                  }}
                >
                  {item}
                </animated.div>
              ))}
            </Trail>
          </chats>

          <dockContain
            css={{
              position: 'absolute',
              bottom: 40,
              left: -50,
              right: -50,
              borderBottom: [4, '#f2f2f2'],
              zIndex: -2,
            }}
          >
            <dock
              css={{
                position: 'absolute',
                bottom: 40,
                right: 0,
                width: '45%',
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

          <orbitals if={false}>
            {[1, 2, 3, 4, 5].map(i => (
              <Triangle
                key={i}
                borderWidth={3}
                size={1}
                borderColor="pink"
                $triangle
                css={{
                  opacity: 0.85,
                  top: -40 * i,
                  left: 10 * i,
                }}
              />
            ))}
          </orbitals>
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
    chats: {
      pointerEvents: 'none',
      position: 'absolute',
      top: 0,
      right: '5%',
      left: '66%',
      bottom: 0,
      // alignItems: 'center',
      justifyContent: 'center',
      transform: {
        // x: 30,
        scale: 1.3,
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
                <main css={{ marginTop: -50 }}>
                  <P fontWeight={600} size={4.4}>
                    Slack is great but it has a{' '}
                    <span $noisy>
                      noise<WavyLine height={1350} $line />
                    </span>{' '}
                    problem
                  </P>
                  <P
                    fontWeight={300}
                    size={2.3}
                    alpha={0.5}
                    margin={[30, 0, 12]}
                  >
                    Your cloud is unruly
                  </P>
                  <P size={2}>
                    You use the best tool for the job. But that can leave you in{' '}
                    <Ul2>silo-hell</Ul2>, with no coherent high level
                    organization. Not to mention all those{' '}
                    <Ul2>damn notifications</Ul2>.
                  </P>
                  <br />
                  <P size={1.6}>
                    Orbit unifies your cloud and sorts whats important into a
                    personal home page. It even alerts you to relevant things
                    based on what you're doing.
                  </P>
                  <br />
                  <P size={1.6}>
                    Turn down noise with a simple <Cmd>⌘+Space</Cmd>.
                  </P>
                  <div $$flex />
                </main>
              </Observer>
              <rightSection
                css={{
                  width: 520,
                  padding: [30, 0, 0],
                  alignItems: 'flex-end',
                  textAlign: 'right',
                }}
              >
                <P size={4} fontWeight={200} color={brandColor}>
                  Pull,<br />
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
class Section4 {
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
                Inspired solutions like <Ul>Stripe Home</Ul>, we set to make a
                tool that turns hidden organizational knowledge into a beautiful
                home base.
              </P2>
              <br />
              <P size={1.2} fontWeight={700}>
                How it does it:
              </P>
              <br />
              <ul>
                <li>
                  <UI.Icon $icon name="check" size={20} color="green" />
                  <P size={1.5}>
                    <strong>Daily heads up</strong>. Unified notification as a
                    newspaper, minus the noise and summarized.
                  </P>
                </li>
                <li>
                  <UI.Icon $icon name="check" size={20} color="green" />
                  <P size={1.5}>
                    <strong>Directory</strong>. Beautiful profiles with relevant
                    recent activity of all co-workers, automatically.
                  </P>
                </li>
                <li>
                  <UI.Icon $icon name="check" size={20} color="green" />
                  <P size={1.5}>
                    <strong>Intelligent search</strong> of everything you do:
                    Slack, your files, tickets, and more.
                  </P>
                </li>
                <li>
                  <UI.Icon $icon name="check" size={20} color="green" />
                  <P size={1.5}>
                    <strong>Realtime answers</strong>. As you compute, hold{' '}
                    <Cmd>Option</Cmd> in any app. Ultra fast OCR uses your
                    screen to provide contextual answers.
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
      width: 400,
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
class Section3 {
  render() {
    return (
      <UI.Theme name="medium">
        <V.Section css={{ background: '#f8f8f8' }}>
          <V.SectionContent fullscreen padded>
            <V.Slant css={{ zIndex: 2 }} />
            <main>
              <P size={1.2} fontWeight={800}>
                Scenario 1
              </P>
              <P2 size={3}>Make your success team more successful.</P2>
              <P2 size={1.8}>
                Orbit works alongside Intercom and Zendesk. Your knowledgebase,
                recently closed tickets and docs now power live, automatic
                answers as you chat.
                <br />
                <br />
                See the <Ul2>exact answer highlighted</Ul2> without typing a
                thing.
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
      <V.Section>
        <V.SectionContent fullscreen padded>
          <V.Slant />
          <main>
            <P size={2.5} fontWeight={800}>
              Save time on Day 1
            </P>
            <br />
            <br />
            <P2 fontWeight={200} size={3}>
              How Orbit helps:
            </P2>
            <ul>
              <li>
                <UI.Icon $icon name="check" size={20} color="green" />
                <P size={1.5}>On-device ML learns what you care about.</P>
              </li>
              <li>
                <UI.Icon $icon name="check" size={20} color="green" />
                <P size={1.5}>Upgrade your OS with an intelligent home.</P>
              </li>
              <li>
                <UI.Icon $icon name="check" size={20} color="green" />
                <P size={1.5}>No installation (3 minute setup).</P>
              </li>
            </ul>
            <br />
            <br />
            <P2 fontWeight={200} size={3}>
              How Orbit works:
            </P2>
            <ul>
              <li>
                <UI.Icon $icon name="check" size={20} color="green" />
                <P size={1.5}>On-device ML learns what you care about.</P>
              </li>
              <li>
                <UI.Icon $icon name="check" size={20} color="green" />
                <P size={1.5}>Upgrade your OS with an intelligent home.</P>
              </li>
              <li>
                <UI.Icon $icon name="check" size={20} color="green" />
                <P size={1.5}>No installation (3 minute setup).</P>
              </li>
            </ul>
          </main>
        </V.SectionContent>
      </V.Section>
    )
  }

  static style = {
    main: {
      width: 400,
      flex: 1,
    },
    ul: {
      margin: 0,
    },
    li: {
      display: 'flex',
      flexFlow: 'row',
      alignItems: 'center',
      fontSize: 22,
      padding: [0, 0, 10, 0],
    },
    icon: {
      marginRight: 10,
    },
  }
}

@view
class Section6 {
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
        <Section5 if={false} />
        <Section6 />
        <Footer />
      </home>
    )
  }
}
