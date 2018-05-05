import * as React from 'react'
import { view } from '@mcro/black'
import Logo from '~/views/logo'
import * as UI from '@mcro/ui'
import * as V from '~/views'

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
        <br />
        <P size={1.4} fontWeight={800}>
          Unify your team
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
          <main>
            <explain>
              <P size={3} fontWeight={800}>
                Orbit sorts through the noise & reduces it down to whats
                important.
              </P>
              <br />
              <P size={2} alpha={0.65}>
                A smart home for everyone at your company
              </P>
            </explain>
            <show />
          </main>
          <orbitals>
            <orbital $spill1 $spill0>
              <P color="#fff" size={2.5} fontWeight={800}>
                Your Slack is about as organized as modern art
              </P>
            </orbital>
            <Triangle
              borderWidth={10}
              size={2}
              borderColor="rgb(0, 111, 73)"
              $triangle
            />
            <orbital $square />
            <orbital $spill $spill3 />
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
      position: 'absolute',
      top: '10%',
      right: '-6%',
      width: 500,
      height: 500,
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
      top: -50,
      left: -100,
      zIndex: 2,
      animation: 'spill3 120s ease-out',
      animationIterationCount: 1,
    },
    spill: {
      animation: 'spill 120s ease-out',
      animationIterationCount: 1,
    },
    spill0: {
      zIndex: 4,
      padding: 85,
    },
    spill12: {
      zIndex: 3,
    },
    spill1: {
      borderRadius: 100000,
    },
    square: {
      width: 360,
      height: 360,
      animation: 'square 120s ease-out',
      background: '#2D3A83',
      zIndex: 1,
      top: 20,
      left: 20,
    },
    spill3: {
      borderRadius: 100000,
      background: '#D3495B',
      top: 30,
      left: 30,
      zIndex: 1,
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
    '@keyframes spill3': {
      from: {
        transform: 'rotate(-40deg)',
      },
      to: {
        transform: 'rotate(20deg) translateX(-150px) translateY(80px)',
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
          <V.SectionContent padded fullscreen>
            <V.Slant inverseSlant />
            <P if={false} size={3} fontWeight={800}>
              A daily heads up<br />that works for you
            </P>
            <br />
            <main>
              <P2 fontWeight={200} size={2.5}>
                Slack is great, but it has a noise problem. Really,<br />
                <Ul>your whole cloud does.</Ul>
              </P2>
              <br />
              <br />
              <P2 fontWeight={800} size={1}>
                How it works:
              </P2>
              <ul>
                <li>
                  <P size={1.5}>Novel, on-device machine learning.</P>
                </li>
                <li>
                  <P size={1.5}>A beautiful interface</P>
                </li>
                <li>
                  <P size={1.5}>No installation (3 minute setup).</P>
                </li>
              </ul>
              <br />
              <br />
              <UI.Text size={4} fontWeight={800}>
                Pull,<br />instead of getting pushed
              </UI.Text>
              <br />
              <P>Give it a pull 👉</P>
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
