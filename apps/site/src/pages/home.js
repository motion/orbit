import * as React from 'react'
import { view } from '@mcro/black'
import Logo from '~/views/logo'
import * as UI from '@mcro/ui'
import * as V from '~/views'
import homeImg from '~/../public/screen-home.png'
import contextImg from '~/../public/screen-context.png'

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
const Section = view(
  'section',
  {
    height: window.innerHeight,
    padding: [70, 50],
  },
  {
    dark: { background: '#111' },
    medium: { background: '#f2f2f2' },
  },
)

@view
class BrandLogo {
  render() {
    return (
      <brandMark>
        <Logo size={0.38} color="#5552FA" />
        <P if={false} size={1} fontWeight={700} alpha={0.8}>
          Your company home
        </P>
      </brandMark>
    )
  }

  static style = {
    brandMark: {
      background: '#fff',
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
        <fadeLines
          css={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(transparent, #fff)',
            zIndex: -1,
          }}
        />
        <V.SectionContent padded fullscreen>
          <V.Slant />
          <top>
            <BrandLogo />
          </top>
          <div $$flex />
          <main>
            <P size={2.8} fontWeight={800}>
              Your company is growing
            </P>
            <P size={3.2} lineHeight={50} margin={[8, 0, 0]}>
              Make it easy to understand whats going on.
            </P>
            <br />
            <P size={1.4} alpha={0.65} lineHeight={30}>
              A personalized newspaper of what you've missed in Slack, and
              across your cloud. All in a beautiful native app powered by
              on-device machine learning.
            </P>
            <show />
          </main>
          <div $$flex />
          <section css={{ width: 400 }}>
            <apply css={{ borderRadius: 10, padding: 20 }}>
              <UI.Text size={1.3}>
                Rolling beta starting: <strong>now</strong>
              </UI.Text>
              <UI.Input
                background="#fff"
                size={1.2}
                sizePadding={2}
                sizeRadius={3}
                margin={[10, 0]}
                borderWidth={2}
                borderColor="green"
                placeholder="your email"
              />
              <UI.Button
                theme="green"
                size={1.2}
                sizeRadius={3}
                margin={[0, 0, 0, 100]}
              >
                Get on the list
              </UI.Button>
            </apply>
          </section>

          <Lines
            width={1000}
            height={2000}
            css={{
              position: 'absolute',
              top: -200,
              left: '50%',
              right: '50%',
              overflow: 'hidden',
              marginLeft: 100,
              zIndex: -2,
              opacity: 0.02,
              // display: 'none',
              transformOrigin: 'top left',
              transform: {
                rotate: '5deg',
                scale: 4,
              },
            }}
          />

          <chats>
            <bubble $left>Your #general chat room</bubble>
            <bubble>About as easy to follow as an acid trip</bubble>
          </chats>

          <orbitals>
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
    },
    bubble: {
      border: [2, '#000'],
      background: '#fff',
      fontSize: 16,
      borderRadius: 15,
      padding: 10,
      marginLeft: 40,
      marginBottom: 10,
      borderBottomRightRadius: 0,
    },
    left: {
      marginLeft: 0,
      marginRight: 40,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 0,
    },
    orbitals: {
      pointerEvents: 'none',
      position: 'absolute',
      top: '25%',
      right: '-10%',
      width: 500,
      height: 500,
      zIndex: 2,
      transform: {
        scale: 1,
      },
    },
    behind: {
      zIndex: -1,
    },
    orbital: {
      userSelect: 'none',
      position: 'absolute',
      top: 0,
      left: 0,
      width: 400,
      height: 400,
      background: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      // whiteSpace: 'nowrap',
      overflowWrap: 'break-word',
    },
    triangle: {
      position: 'absolute',
      zIndex: 5,
      animation: 'triangle 420s linear infinite',
      transformOrigin: '450px 300px',
    },
    spill: {
      animation: 'spill 120s linear infinite',
    },
    orbitText: {
      zIndex: 4,
      padding: 85,
    },
    spill12: {
      zIndex: 3,
    },
    square: {
      width: 360,
      height: 360,
      animation: 'square 90s linear infinite',
      background: '#0B507E',
      zIndex: 1,
      top: 20,
      left: 20,
    },
    circle: {
      borderRadius: 100000,
      background: '#D3495B',
      top: 30,
      left: 30,
      zIndex: 1,
      width: 350,
      height: 350,
    },
    '@keyframes spill': {
      from: {
        transform: 'rotate(20deg)',
      },
      to: {
        transform: 'scale(180deg)',
      },
    },
    '@keyframes square': {
      from: {
        transform: 'rotate(60deg)',
      },
      to: {
        transform: 'rotate(-20deg)',
      },
    },
    '@keyframes triangle': {
      from: {
        transform: 'rotate(0deg)',
      },
      to: {
        transform: 'rotate(360deg)',
      },
    },
  }
}

@view
class Section2 {
  render() {
    return (
      <UI.Theme name="light">
        <V.Section>
          <V.SectionContent doublePadded fullscreen>
            <V.Slant inverseSlant />
            <main>
              <P2 fontWeight={200} size={3.2}>
                <span css={{ background: 'yellow', fontWeight: 300 }}>
                  Slack is great
                </span>{' '}
                but it has a noise problem.
              </P2>
              <br />
              <P2 fontWeight={200} size={2.4}>
                Really, your whole cloud does.
              </P2>
              <br />
              <br />
              <br />
              <br />
              <rightSection
                css={{
                  width: 450,
                  padding: [20, 0],
                  alignItems: 'flex-end',
                  textAlign: 'right',
                }}
              >
                <P size={4} fontWeight={800}>
                  Pull,<br />
                  <span css={{ marginRight: -10 }}>instead of</span>
                  <br />
                  <span css={{ marginRight: -20 }}>getting pushed</span>
                </P>
                <br />
                <P size={2} css={{ marginRight: -30 }}>
                  Give it a pull&nbsp; 👈
                </P>
              </rightSection>
            </main>
            <div $$flex />
            <div
              $$row
              css={{
                textAlign: 'right',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}
            />
            <illustration>
              <img
                src={homeImg}
                css={{
                  width: 550,
                  height: 'auto',
                  position: 'absolute',
                  top: 80,
                  right: -80,
                  zIndex: -1,
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
            <main>
              <P size={2.5} fontWeight={800}>
                Give your team answers <em>before</em> they have to ask.
              </P>
              <br />
              <P2>
                Orbit sits by the side of any app, searching in real-time as you
                work -- answering questions from anywhere in your cloud.
              </P2>
              <br />
              <br />
              <P2>Writing an email.</P2>
              <br />
              <P2>Talking on slack.</P2>
              <br />
              <P2>Editing a document.</P2>
              <br />
              <P2>Stop reaching out to each other.</P2>
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
class Section4 {
  render() {
    return (
      <UI.Theme name="light">
        <V.Section>
          <V.SectionContent padded fullscreen>
            <V.Slant inverseSlant />
            <main>
              <P size={2.5} fontWeight={800}>
                Reduced interruptions in-office & an increased sense of unity.
              </P>
              <br />
              <br />
              <P2>
                Inspired by Stripe and Facebook, we set out to make an
                incredible intranet for everyone: saving time and removing
                stress from everyday work.
              </P2>
              <br />
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
            <V.Slant inverseSlant backgroundColor="#000" />
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
      <section css={{ padding: 100 }}>
        <top>
          <BrandLogo />
        </top>
      </section>
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
        <Footer />
      </home>
    )
  }
}
