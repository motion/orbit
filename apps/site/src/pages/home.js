import * as React from 'react'
import { view } from '@mcro/black'
import Logo from '~/views/logo'
import * as UI from '@mcro/ui'
import * as V from '~/views'

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
                We grow with you.
              </P>
              <br />
              <P size={2} alpha={0.65}>
                Orbit is a smart home plate for your entire company.
              </P>
            </explain>
            <show />
          </main>
          <orbitals>
            <orbital $spill1 $spill0>
              <P color="#fff" size={2.5} fontWeight={800}>
                You've outgrown Slack.
              </P>
            </orbital>
            <orbital $spill $spill1 $spill12 />
            <orbital $spill $spill2 />
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
    orbitals: {
      position: 'absolute',
      top: '10%',
      right: '-6%',
      width: 500,
      height: 500,
    },
    orbital: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 400,
      height: 400,
      background: 'transparent',
      border: [10, '#000'],
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      // whiteSpace: 'nowrap',
      overflowWrap: 'break-word',
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
    spill2: {
      width: 360,
      height: 360,
      animation: 'spill2 120s ease-out',
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
        transform: 'scale(1)',
      },
      to: {
        transform: 'scale(1.25)',
      },
    },
    '@keyframes spill2': {
      from: {
        transform: 'scale(1) rotate(-20deg)',
      },
      to: {
        transform: 'scale(1.25) rotate(50deg)',
      },
    },
  }
}

@view
class Section2 {
  render() {
    return (
      <UI.Theme name="light">
        <V.Section padded>
          <V.SectionContent fullscreen>
            <V.Slant inverseSlant />
            <P size={3} fontWeight={800}>
              A daily heads up<br />that works for you
            </P>
            <br />
            <main>
              <P2 fontWeight={200} size={2.5}>
                Slack is great, but it has a noise problem. Really,<br />
                <Ul>your whole cloud does.</Ul>
              </P2>
            </main>
            <P2>Wish you could tame it?</P2>
            <div $$flex />
            <div
              $$row
              css={{
                textAlign: 'right',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}
            >
              <section css={{ width: 400 }}>
                <UI.Text size={4} fontWeight={800} color="#fff">
                  Pull,<br />instead of getting pushed
                </UI.Text>
                <br />
                <P>Give it a pull 👉</P>
              </section>
            </div>
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
              Grow your organization, without losing your organization.
            </P>
            <br />
            <br />
            <P2>
              Inspired by modern tech companies' intranets[1], we set out to
              make yours easy, fun, and far more powerful.
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
