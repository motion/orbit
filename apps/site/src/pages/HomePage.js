import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Header, Join } from '~/components'
import SectionContent from '~/views/sectionContent'
import { Stars } from '~/views/stars'
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
            <Section
              css={{
                background: `linear-gradient(${Constants.leftBg.lighten(
                  0.2,
                )}, ${Constants.leftBg})`,
              }}
            >
              <Stars
                $$fullscreen
                css={{
                  opacity: 0.8,
                  zIndex: 0,
                }}
              />
              <rightBackground
                $$fullscreen
                css={{ background: Constants.rightBg, left: '55%' }}
              />
              <SectionContent padded fullscreen>
                <Slant
                  slantSize={10}
                  amount={60}
                  slantGradient={[
                    'rgba(255,255,255,0.1)',
                    'rgba(255,255,255,0.1)',
                  ]}
                  css={{ zIndex: 0 }}
                />
                <Slant
                  inverseSlant
                  rightBackground={Constants.rightBg}
                  slantSize={0}
                  amount={30}
                  css={{
                    zIndex: 0,
                  }}
                />
                <Slant
                  slantBackground={Constants.colorSecondary}
                  slantSize={2}
                  amount={15}
                  css={{ zIndex: 0 }}
                />
                <div $$flex />
                <UI.Theme name="dark">
                  <mainSection $smallCallout={!isLarge} $largeCallout={isLarge}>
                    <Title
                      italic
                      size={isMedium ? 4 : 4.5}
                      margin={[-15, '10%', -15, -5]}
                      alpha={1}
                    >
                      Desktop 2.0
                    </Title>
                    <borderLine />
                    <below css={{ margin: [0, isLarge ? '25%' : 0, 10, 0] }}>
                      <P
                        size={1.35}
                        sizeLineHeight={1.15}
                        fontWeight={300}
                        alpha={0.8}
                      >
                        Orbit is a new operating layer for your desktop. Unified
                        cloud knowledge, sorted at your fingertips. It's&nbsp;a
                        smarter way to sync teams.
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
                            fill: '#fff',
                            display: 'inline-block',
                            margin: [-2, 0, 0, 4],
                            opacity: 0.32,
                          }}
                        />
                      </UI.Button>
                      <UI.Button
                        chromeless
                        alpha={0.4}
                        onClick={Router.link('/features')}
                        margin={[0, 0, 0, 10]}
                        css={{
                          cursor: 'pointer',
                        }}
                      >
                        Learn more
                      </UI.Button>
                    </actions>
                  </mainSection>
                </UI.Theme>
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
      margin: [30, 40, 10, 0],
      width: '65%',
      height: 1,
      background: [255, 255, 255, 0.05],
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
  background: UI.color(Constants.leftBg),
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
                background: blackTheme.background,
              }}
              inverse
            >
              <Stars
                $$fullscreen
                css={{
                  opacity: 0.8,
                  zIndex: 0,
                }}
              />
              <rightBackground
                $$fullscreen
                css={{ background: Constants.rightBg, left: '55%' }}
              />
              <SectionContent padded fullscreen>
                <Slant
                  inverseSlant
                  slantSize={10}
                  amount={60}
                  slantGradient={[
                    'rgba(255,255,255,0.1)',
                    'rgba(255,255,255,0.3)',
                  ]}
                  css={{ zIndex: 3 }}
                />
                <Slant
                  slantSize={0}
                  rightBackground={Constants.rightBg}
                  amount={30}
                />
                <Slant
                  inverseSlant
                  slantBackground={Constants.colorSecondary}
                  slantSize={2}
                  amount={15}
                  css={{ zIndex: 0 }}
                />
                <LeftSide css={{ textAlign: 'left' }}>
                  <div css={{ height: '22%' }} />
                  <below css={{ margin: [15, '10%', 0, 0] }}>
                    <P2 size={3.5} alpha={1} fontWeight={200}>
                      We live and work with&nbsp;technology.
                    </P2>
                    <br />
                    <UI.PassProps size={1.3} sizeLineHeight={1.2} alpha={0.85}>
                      <P2>
                        It's time our devices got a little smarter. You have
                        knowledge spread all over. Orbit puts it to work. We're
                        making sense of all the incoming on your desktop. And
                        it's{' '}
                        <span css={{ fontWeight: 500, fontStyle: 'italic' }}>
                          completely private, with no data leaving your computer
                        </span>.
                      </P2>
                      <P2>
                        Orbit solves hard problems to make it's experience
                        enjoyable. It's an app that you'll interact with often,
                        so we know we have to get the experience right.
                      </P2>
                      <P2 size={1.4}>
                        Learn more about{' '}
                        <SubLink>how we're building it</SubLink>.
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
        <Header white />
        <HomeHeader isMedium={isMedium} />
        <HomeFooter isMedium={isMedium} />
      </>
    )}
  </Media>
)
