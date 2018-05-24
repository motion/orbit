import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Header, Join } from '~/components'
import SectionContent from '~/views/sectionContent'
import {
  Section,
  Slant,
  Title,
  P,
  P2,
  LeftSide,
  RightSide,
  AppleLogo,
} from '~/views'
// import girlImg from '~/public/video-girl.jpg'
import { HomeIllustration } from './HomeIllustration'
import * as Constants from '~/constants'
import Media from 'react-media'
import Router from '~/router'
import { scrollTo } from '~/helpers'

const SubLink = view('a', {
  color: '#fff',
  borderBottom: [1, 'dotted', [255, 255, 255, 0.1]],
})

@view
class HomeHeader {
  render({ isMedium }) {
    return (
      <Media query={Constants.screen.large}>
        {isLarge => {
          return (
            <Section css={{ background: '#fff' }}>
              <SectionContent padded fullscreen>
                <Slant
                  inverseSlant
                  slantGradient={[
                    Constants.colorSecondary,
                    Constants.colorSecondary.lighten(0.4),
                  ]}
                  slantSize={4}
                  amount={20}
                />
                <Slant
                  slantGradient={['#fcfcfc', '#f9f9f9']}
                  css={{ zIndex: 2 }}
                />
                <div $$flex />
                <mainSection $smallCallout={!isLarge} $largeCallout={isLarge}>
                  <Title
                    italic
                    size={isMedium ? 5 : 6}
                    margin={[-15, 0, -15, -5]}
                    alpha={0.9}
                  >
                    Incoming,<br />
                    sorted.
                  </Title>
                  <borderLine />
                  <below css={{ margin: [0, isLarge ? '25%' : 0, 10, 0] }}>
                    <P
                      size={1.6}
                      sizeLineHeight={1.2}
                      fontWeight={300}
                      alpha={0.8}
                    >
                      A smarter operating system for your day.
                      Orbit&nbsp;augments Mac with team knowledge and gives you
                      a clear view of your cloud.
                    </P>
                  </below>
                  <actions
                    $$row
                    css={{
                      margin: isLarge ? [25, 'auto', 0, 0] : [20, 0, 0, 0],
                      alignItems: 'center',
                    }}
                  >
                    <UI.Button
                      borderStyle="dotted"
                      borderColor="#ccc"
                      size={1.1}
                      onClick={scrollTo('#join')}
                      $smallInstallBtn={!isLarge}
                      tooltip=""
                      css={{
                        margin: [0, 10, 0, 0],
                        cursor: 'pointer',
                        lineHeight: '1.1rem',
                      }}
                    >
                      Coming soon for{' '}
                      <AppleLogo
                        width={20}
                        height={20}
                        css={{
                          display: 'inline-block',
                          margin: [-2, 0, 0, 0],
                          opacity: 0.32,
                        }}
                      />
                    </UI.Button>
                    <UI.Button
                      chromeless
                      alpha={0.5}
                      onClick={() => Router.go('/features')}
                      margin={[0, 0, 0, 10]}
                      css={{
                        cursor: 'pointer',
                      }}
                    >
                      Learn more
                    </UI.Button>
                  </actions>
                </mainSection>
                <div $$flex />
                <rightSide>
                  <Media
                    query={Constants.screen.large}
                    render={() => <HomeIllustration />}
                  />
                </rightSide>
              </SectionContent>
            </Section>
          )
        }}
      </Media>
    )
  }

  static style = {
    mainSection: {
      position: 'relative',
      zIndex: 10,
    },
    smallCallout: {
      padding: [0, 0, 40, 0],
    },
    largeCallout: {
      width: '54%',
      margin: [-15, 0, 0, 0],
    },
    borderLine: {
      margin: [30, 40, 20],
      width: '53%',
      height: 4,
      background: '#ddd',
      opacity: 0.15,
    },
    smallInstallBtn: {
      // transform: {
      //   scale: 1.2,
      // },
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
      left: '50%',
      pointerEvents: 'none',
    },
  }
}

const blackBg = UI.color('#111')
const blackTheme = {
  background: UI.color('#111'),
  color: '#f2f2f2',
  subTitleColor: '#eee',
  titleColor: blackBg.darken(0.75).desaturate(0.3),
}

@view
class HomeFooter {
  render() {
    return (
      <UI.Theme theme={blackTheme}>
        <Media query={Constants.screen.large}>
          {isLarge => (
            <Section
              css={{
                background: `linear-gradient(${
                  blackTheme.background
                }, ${blackTheme.background.darken(0.15).desaturate(0.2)})`,
              }}
              inverse
            >
              <SectionContent padded fullscreen>
                <Slant
                  css={{ zIndex: 1 }}
                  slantSize={20}
                  inverseSlant
                  slantGradient={[
                    blackTheme.background.darken(0.3),
                    blackTheme.background.darken(0.35),
                  ]}
                />
                <Slant
                  slantSize={4}
                  amount={20}
                  slantGradient={[
                    Constants.colorSecondary.darken(0.1),
                    Constants.colorSecondary.darken(0.6),
                  ]}
                />
                <LeftSide css={{ textAlign: 'left' }}>
                  <div css={{ height: '22%' }} />
                  <below css={{ margin: [15, '5%', 0, 0] }}>
                    <P2 size={3.5} alpha={1} fontWeight={200}>
                      We live and work with&nbsp;technology.
                    </P2>
                    <br />
                    <UI.PassProps size={1.7} alpha={0.85}>
                      <P2>
                        It's time our devices got a little smart. Making sense
                        of whats happening at your company is best done on your
                        desktop because{' '}
                        <span css={{ fontWeight: 500, fontStyle: 'italic' }}>
                          you can't risk sharing all your sensitive data with a
                          third party
                        </span>.
                      </P2>
                      <P2>
                        That's why Orbit runs entirely privately on your
                        computer. It's an app that you'll interact with often,
                        so we know we have to get the experience right.
                      </P2>
                      <P2 size={2.2}>
                        Learn more on how we're building{' '}
                        <SubLink>better UX without the cloud</SubLink>.
                      </P2>
                    </UI.PassProps>
                  </below>
                </LeftSide>
                <RightSide noEdge $$centered>
                  <Join />
                </RightSide>
              </SectionContent>
            </Section>
          )}
        </Media>
      </UI.Theme>
    )
  }
}

export const HomePage = () => (
  <Media query={Constants.screen.medium}>
    {isMedium => (
      <>
        <Header />
        <HomeHeader isMedium={isMedium} />
        <HomeFooter isMedium={isMedium} />
      </>
    )}
  </Media>
)
