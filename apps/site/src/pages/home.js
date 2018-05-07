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
import SVGInline from 'react-svg-inline'

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

const Icon = ({ size, icon, scale = 1, after, ...props }) => (
  <slackIcon
    css={{ position: 'relative', width: size * 512, height: size * 512 }}
  >
    <SVGInline
      cleanup
      svg={icon}
      width={512}
      height={512}
      css={{ transformOrigin: 'top left', transform: { scale: size * scale } }}
      {...props}
    />
    {after}
  </slackIcon>
)

const SlackIcon = props => <Icon {...props} icon={slackIcon} />
const DriveIcon = props => <Icon {...props} scale={1.8} icon={driveIcon} />
const DropboxIcon = props => <Icon {...props} icon={dropboxIcon} />

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

const Callout = ({ style, ...props }) => (
  <section
    style={style}
    css={{
      width: '59%',
      background: '#fff',
      // border: [5, '#fff'],
      zIndex: 10,
      overflow: 'hidden',
      position: 'relative',
    }}
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
      css={{ margin: 12, padding: 40, background: '#fff' }}
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
      alignSelf: 'flex-end',
      alignItems: 'center',
      textAlign: 'center',
    },
  }
}

@view
class Header {
  render() {
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
          <top>
            <BrandLogo />
          </top>
          <div $$flex />
          <Callout css={{ margin: -34 }}>
            <P size={2.1} fontWeight={800} color={brandColor}>
              Your company is growing
            </P>
            <P size={4.3} margin={[8, 0]}>
              Make it easy to understand what's going on.
            </P>
            <P size={2} alpha={0.7} margin={[10, 0, 20]}>
              Everything important at your company, at your fingertips. Tame the
              cloud with private on-device machine learning.
            </P>
            <div $$row>
              <div $$flex />
              <UI.Button
                background="#fff"
                color="blue"
                size={1.2}
                borderWidth={1}
                borderColor="blue"
                fontWeight={300}
              >
                <span css={{ fontWeight: 500 }}>Early access list</span>{' '}
                &nbsp;&middot;&nbsp; <span css={{ fontWeight: 800 }}>$200</span>
              </UI.Button>
            </div>
          </Callout>
          <div $$flex />

          <linesContain
            css={{
              position: 'absolute',
              top: -200,
              left: '50%',
              right: -500,
              bottom: -500,
              overflow: 'hidden',
              zIndex: -2,
              transform: { rotate: '5deg' },
            }}
          >
            <Lines
              width={1000}
              height={2000}
              css={{
                position: 'absolute',
                top: -200,
                left: -500,
                right: '50%',
                overflow: 'hidden',
                marginLeft: 100,
                zIndex: -2,
                opacity: 0.015,
                // display: 'none',
                transformOrigin: 'top left',
                transform: {
                  scale: 6,
                },
              }}
            />
          </linesContain>

          <chats>
            <bubble $left>The #general chat room</bubble>
            <bubble>About as easy to follow as an acid trip</bubble>
            <bubble $left>🙄</bubble>
          </chats>

          <dock
            css={{
              position: 'absolute',
              bottom: 0,
              right: '-2.5%',
              width: '45%',
              alignItems: 'flex-end',
              justifyContent: 'center',
              flexFlow: 'row',
              background: '#f9f9f9',
              borderTopRadius: 10,
              padding: [0, 0, 10],
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              border: [1, '#ddd'],
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
            <DropboxIcon size={0.16} after={<Badge>3</Badge>} />
            <DriveIcon size={0.13} after={<Badge>22</Badge>} />
          </dock>

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
      position: 'absolute',
      top: 0,
      right: 0,
      left: '65%',
      bottom: 0,
      // alignItems: 'center',
      justifyContent: 'center',
      transform: {
        x: 30,
        scale: 1.3,
      },
    },
    bubble: {
      border: [2, '#000'],
      background: '#fff',
      fontSize: 16,
      borderRadius: 15,
      padding: 10,
      marginBottom: 10,
      borderBottomRightRadius: 0,
      alignSelf: 'flex-end',
    },
    left: {
      alignSelf: 'flex-start',
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 0,
    },
  }
}

@view
class Section2 {
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
              <main css={{ marginTop: -50 }}>
                <P fontWeight={200} size={4.5}>
                  Slack is great but it has a{' '}
                  <span $noisy>
                    noise<line>~~~~~~~~~~~~~~~~~~~</line>
                  </span>{' '}
                  problem.
                </P>
                <br />
                <P fontWeight={200} size={2.4}>
                  Really, your whole cloud does.
                  <br />
                  <br />
                  Orbit is an Mac app that unifies your cloud and keeps your
                  team in sync. Allow them to turn off notifications and focus.
                  We call it:
                </P>
                <div $$flex />
              </main>
              <rightSection
                css={{
                  width: 450,
                  padding: [20, 0, 0],
                  alignItems: 'flex-end',
                  textAlign: 'right',
                }}
              >
                <P size={3.5} fontWeight={800}>
                  Pull,<br />
                  <span css={{ marginRight: -10 }}>instead of</span>
                  <br />
                  <span css={{ marginRight: -20 }}>being pushed</span>
                </P>
                <br />
                <P size={2} css={{ marginRight: -30 }}>
                  <Cmd>⌘+Space</Cmd> just got a whole lot better
                </P>
                <P if={false} size={2}>
                  Give it a pull&nbsp; 👈
                </P>
              </rightSection>
            </UI.Theme>
            <explain>
              <notification
                css={{
                  width: 300,
                  height: 70,
                  background: '#f3f3f3',
                  border: [1, '#ddd'],
                  padding: 20,
                  borderRadius: 10,
                  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                }}
              >
                Notification
              </notification>
            </explain>
            <linesContain
              if={false}
              css={{
                position: 'absolute',
                top: -200,
                left: '50%',
                right: '-50%',
                bottom: 0,
                overflow: 'hidden',
                zIndex: -2,
                transform: { rotate: '-5deg' },
              }}
            >
              <Lines
                width={1000}
                height={2000}
                css={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  overflow: 'hidden',
                  marginLeft: 100,
                  opacity: 0.02,
                  // display: 'none',
                  transformOrigin: 'top left',
                  transform: {
                    rotate: '10deg',
                    x: '-12.8%',
                    scale: 3,
                  },
                }}
              />
            </linesContain>
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
    explain: {
      position: 'absolute',
      top: 260,
      width: 300,
      left: '65%',
    },
    noisy: {
      position: 'relative',
    },
    line: {
      userSelect: 'none',
      fontWeight: 400,
      position: 'absolute',
      bottom: -28,
      left: -30,
      right: -30,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      letterSpacing: -10,
      color: 'rgb(99.9%, 37.9%, 0%)',
      transform: {
        scale: 0.7,
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
              inverseSlant
              css={{ filter: 'grayscale(0%)', zIndex: 2 }}
            />
            <main>
              <P size={2.5} fontWeight={800}>
                Reduced interruptions with a side of unity.
              </P>
              <br />
              <br />
              <P2 size={2.2}>
                Inspired by intranet systems at Stripe and Facebook, we wanted
                to make an intranet that actually makes your team happier and
                more productive.
              </P2>
              <br />
              <ul>
                <li>
                  <UI.Icon $icon name="check" size={20} color="green" />
                  <P size={1.5}>
                    A daily heads up. News on what you've missed going on in
                    your company.
                  </P>
                </li>
                <li>
                  <UI.Icon $icon name="check" size={20} color="green" />
                  <P size={1.5}>
                    A beautiful directory of all your employees, automatically.
                  </P>
                </li>
                <li>
                  <UI.Icon $icon name="check" size={20} color="green" />
                  <P size={1.5}>
                    Intelligent search of Slack, your files, tickets, and more.
                  </P>
                </li>
                <li>
                  <UI.Icon $icon name="check" size={20} color="green" />
                  <P size={1.5}>
                    Answers as your work. Orbit can search based on what you're
                    doing, showing in a sidebar just by holding{' '}
                    <Cmd>Option</Cmd>.
                  </P>
                </li>
              </ul>
              <br />
              <P2>
                Silicon Valley has finally delivered <Ul>a new intranet</Ul>.
              </P2>
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
class Section3 {
  render() {
    return (
      <UI.Theme name="medium">
        <V.Section css={{ background: '#f2f2f2' }}>
          <V.SectionContent fullscreen padded>
            <V.Slant css={{ filter: 'grayscale(100%)', zIndex: 2 }} />
            <P size={2.5} fontWeight={800}>
              How it saves time
            </P>
            <br />
            <br />
            <P size={1.2} fontWeight={800}>
              Case study 1
            </P>
            <P2>Upgrade your chat team overnight.</P2>
            <main>
              <P2 size={1.7}>
                Orbit puts your knowledgebase, wiki, project management tickets,
                and docs at the tip of your fingers.
              </P2>
              <P2 size={1.7}>
                But that's not all. Orbit can attach to any app and scan your
                current conversation in real-time, showing the{' '}
                <em>exact section</em> within a document that provides the
                answer to what you're looking at.
              </P2>
              <br />
              <P size={1.2} fontWeight={800}>
                The Result
              </P>
              <P2 size={2.5}>
                Your customer success team answers questions faster & more
                accurately. It only takes 3 minutes to install.
              </P2>
            </main>
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
      width: 400,
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
                We want to grow with you.
              </P>
              <br />
              <main>
                <P2 fontWeight={200} size={2.5}>
                  We want to build the ultimate system for keeping your company
                  happily in the know. We've already made the first few steps.
                  But we want to finish it by working with you.
                </P2>
              </main>
              <br />
              <br />
              <P2>
                Sound fun? <Ul>Get in touch</Ul>.
              </P2>
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
          <BrandLogo />
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
