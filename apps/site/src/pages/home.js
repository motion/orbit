import * as React from 'react'
import { view } from '@mcro/black'
import Logo from '~/views/logo'
import * as UI from '@mcro/ui'
import * as V from '~/views'

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
        <Logo size={0.5} color="#222" />
        <P if={false} size={1.25} fontWeight={700} alpha={0.8}>
          Your company home
        </P>
      </brandMark>
    )
  }

  static style = {
    brandMark: {
      alignSelf: 'flex-end',
      alignItems: 'center',
      textAlign: 'center',
      marginRight: 20,
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
          <top>
            <BrandLogo />
          </top>
          <div $$flex />
          <div $$flex />
          <main>
            <P size={3.3} fontWeight={800}>
              Your business is growing, and so are your communication problems.
            </P>
            <br />
            <P size={2} alpha={0.65}>
              Orbit provides a smart personal home for your team. Remove
              interruptions, reduce noise, and unify your organizational
              knowledge.
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
              left: '-50%',
              right: '50%',
              overflow: 'hidden',
              marginLeft: 100,
              zIndex: -1,
              opacity: 0.02,
              // display: 'none',
              transformOrigin: 'top left',
              transform: {
                rotate: '5deg',
                scale: 4,
              },
            }}
          />

          <orbitals $behind>
            <orbital $square />
          </orbitals>
          <orbitals>
            <orbital $orbitText>
              <P color="#fff" size={2.5} fontWeight={800}>
                Slack:<br />
                clear as modern art.
              </P>
            </orbital>
            <Triangle
              borderWidth={10}
              size={1.8}
              borderColor="pink"
              $triangle
              css={{
                opacity: 0.85,
                top: -40,
                left: -200,
              }}
            />
            <orbital $circle />
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
      width: 600,
      background: '#fff',
      border: [10, '#f2f2f2'],
      zIndex: 2,
      padding: 30,
      margin: -30,
    },
    title: {
      fontSize: 40,
    },
    small: {
      fontSize: 14,
      fontWeight: 300,
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
        scale: 1.2,
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
            <P if={false} size={3} fontWeight={800}>
              A daily heads up<br />that works for you
            </P>
            <br />
            <main>
              <P2 fontWeight={200} size={3.2}>
                Slack is great but it has a noise problem.
              </P2>
              <br />
              <P2 fontWeight={200} size={2.4}>
                Really, your whole cloud does.
              </P2>
              <br />
              <br />
              <P2 fontWeight={800} size={1}>
                How Orbit helps
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
              <rightSection
                css={{ width: 450, alignItems: 'flex-end', textAlign: 'right' }}
              >
                <UI.Text size={4} fontWeight={800}>
                  Pull,<br />
                  <span css={{ marginRight: -10 }}>instead of</span>
                  <br />
                  <span css={{ marginRight: -20 }}>getting pushed</span>
                </UI.Text>
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
          </V.SectionContent>
        </V.Section>
      </UI.Theme>
    )
  }

  static style = {
    main: {
      width: 400,
    },
    li: {
      display: 'flex',
      flexFlow: 'row',
      alignItems: 'center',
      fontSize: 22,
      padding: [10, 0],
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
        <Section medium>
          <main>
            <P size={3} fontWeight={800}>
              Your organization grows.
              <br />
              <br />
              We keep it organized.
            </P>
            <br />
            <br />
            <P2>
              Inspired by modern tech companies' intranet solutions, we set out
              to make your even better: easy, interpretable, and powerful.
            </P2>
            <br />
            <br />
            <P2>
              Silicon Valley has finally delivered <Ul>a new intranet</Ul>.
            </P2>
          </main>
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
class Section4 {
  render() {
    return (
      <UI.Theme name="light">
        <Section>
          <main>
            <P size={3} fontWeight={800}>
              Search comes for free.
            </P>
            <br />
            <br />
            <P2>
              Upgrade spotlight with search across all your services, more
              powerful than any of your services.
            </P2>
            <br />
            <br />
            <P2>
              Learn more on <Ul>how it works</Ul>.
            </P2>
          </main>
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
class Section5 {
  render() {
    return (
      <UI.Theme name="dark">
        <Section dark>
          <main>
            <P size={3} fontWeight={800}>
              We want to grow with you.
            </P>
            <br />
            <main>
              <P2 fontWeight={200} size={2.5}>
                We want to build the ultimate intranet system for your company.
                We've already made the first few steps. But we want to finish it
                by working with you.
              </P2>
            </main>
            <br />
            <br />
            <P2>
              Sound fun? <Ul>Get in touch</Ul>.
            </P2>
          </main>
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
        <Footer />
      </home>
    )
  }
}
