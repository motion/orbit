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
import { Keyframes, Spring, animated } from 'react-spring'
import topo from '~/public/topo2.svg'

const SubLink = view('a', {
  // color: '#fff',
  borderBottom: [1, 'dotted', [0, 0, 0, 0.1]],
})

class HomeStore {
  stars = null

  willMount() {
    // window.addEventListener(
    //   'scroll',
    //   throttle(() => {
    //     const max = window.innerHeight * 3
    //     // 0 - 1 of how far down we are
    //     const pctDown =
    //       (max - (max - document.scrollingElement.scrollTop)) / max
    //     const offset = pctDown * 100
    //     // this.stars.stopAnimation()
    //     this.stars(Spring, {
    //       to: { y: -offset },
    //     })
    //   }, 16),
    // )

    setTimeout(() => {
      this.stars(Spring, {
        to: { y: 0 },
      })
    })
  }
}

@view({
  store: HomeStore,
})
class HomeHeader extends React.Component {
  render({ isMedium, store }) {
    return (
      <Media query={Constants.screen.large}>
        {isLarge => {
          return (
            <Section css={{ background: 'transparent' }}>
              {/* <Keyframes native script={ref => (store.stars = ref)}>
                {({ y }) => (
                  <animated.div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      transform: y.interpolate(y => `translate3d(0,${y}%,0)`),
                    }}
                  >
                    <Stars
                      $$fullscreen
                      css={{
                        zIndex: 0,
                      }}
                    />
                  </animated.div>
                )}
              </Keyframes> */}
              <rightBackground
                $$fullscreen
                css={{ background: Constants.rightBg, left: '55%' }}
              />
              <SectionContent padded fullscreen>
                <Slant slantSize={0} amount={40} css={{ zIndex: 0 }} />
                <Slant
                  inverseSlant
                  slantSize={2}
                  amount={20}
                  slantBackground="#f2f2f2"
                  rightBackground="#fff"
                  css={{ zIndex: 0 }}
                />
                <Slant
                  slantSize={10}
                  amount={40}
                  slantBackground="#f9f9f9"
                  css={{ zIndex: 0 }}
                />
                <Slant
                  slantGradient={[
                    Constants.colorSecondary.alpha(0.5),
                    Constants.colorSecondary,
                  ]}
                  slantSize={2}
                  amount={15}
                  css={{ zIndex: 0 }}
                />
                <spacer $$flex={1} />
                <UI.Theme name="light">
                  <mainSection $smallCallout={!isLarge} $largeCallout={isLarge}>
                    <Title
                      italic
                      size={isMedium ? 5 : 6}
                      margin={[0, 0, -15, -3]}
                      alpha={1}
                      color={Constants.colorMain}
                    >
                      Rethinking the&nbsp;desktop
                    </Title>
                    <borderLine />
                    <below>
                      <P
                        size={1.35}
                        sizeLineHeight={1.15}
                        fontWeight={300}
                        alpha={0.8}
                      >
                        Orbit is a smart operating layer for your Mac that keeps
                        team knowledge sorted and at hand.
                      </P>
                      <P
                        if={false}
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
                        borderColor="#f2f2f2"
                        size={1.1}
                        onClick={scrollTo('#join')}
                        $smallInstallBtn={!isLarge}
                        tooltip=""
                        css={{
                          margin: [0, 10, 0, -10],
                          cursor: 'pointer',
                          lineHeight: '1.1rem',
                        }}
                      >
                        Coming soon for{' '}
                        <AppleLogo
                          width={20}
                          height={20}
                          css={{
                            // fill: '#fff',
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
                <spacer $$flex />
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
    spacer: {
      pointerEvents: 'none',
    },
    mainSection: {
      position: 'relative',
      zIndex: 10,
      background: '#fff',
      flex: 'none',
    },
    smallCallout: {
      padding: [0, 0, 40, 0],
    },
    largeCallout: {
      display: 'inline-block',
      width: '45%',
      minWidth: 520,
      border: [1, [0, 0, 0, 0.04]],
      padding: [60, 40],
      margin: [-60, -40],
    },
    borderLine: {
      margin: [40, 40, 20, 0],
      width: '65%',
      height: 1,
      background: [0, 0, 0, 0.05],
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
class HomeFooter extends React.Component {
  render() {
    return (
      <UI.Theme theme="light">
        <Media query={Constants.screen.large}>
          {isLarge => (
            <Section
              css={{
                background: 'transparent',
              }}
              inverse
            >
              <SectionContent padded fullscreen>
                <Slant
                  inverseSlant
                  slantSize={10}
                  amount={40}
                  slantBackground="#f9f9f9"
                  css={{ zIndex: 0 }}
                />
                <Slant
                  slantSize={2}
                  amount={20}
                  slantBackground="#f2f2f2"
                  rightBackground="#fff"
                  css={{ zIndex: 0 }}
                />
                <Slant
                  inverseSlant
                  slantBackground={Constants.colorSecondary}
                  slantSize={2}
                  amount={15}
                />
                <LeftSide css={{ textAlign: 'left' }}>
                  <div css={{ height: '22%' }} />
                  <below css={{ margin: [15, '15%', 0, 0] }}>
                    <UI.PassProps
                      size={1.3}
                      sizeLineHeight={1.2}
                      alpha={0.85}
                      style={{
                        background: '#fff',
                        padding: 5,
                        margin: -5,
                        marginBottom: 15,
                      }}
                    >
                      <P2 size={2.8} alpha={1} fontWeight={400}>
                        It's time our computers helped us stay sharp.
                      </P2>
                      <P2>
                        You and your team have knowledge all over. Orbit gives
                        you the tools and interface to put it to use. We think
                        any organizational tool has to be{' '}
                        <span css={{ fontWeight: 500, fontStyle: 'italic' }}>
                          completely private
                        </span>.
                      </P2>
                      <P2>
                        Orbit wants to make your day to day work interpretable
                        and fluid. It's an app that you'll interact with often,
                        so we know we have to get the details right.
                      </P2>
                      <space css={{ height: 25 }} />
                      <P2 color={Constants.colorMain} fontWeight={500}>
                        Sign up for early access to learn more as we build it.
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
        <leftBackground
          $$fullscreen
          css={{
            right: '45%',
            zIndex: 0,
            opacity: 0.035,
            background: `url(${topo})`,
          }}
        />
        <Header />
        <HomeHeader isMedium={isMedium} />
        <HomeFooter isMedium={isMedium} />
      </>
    )}
  </Media>
)
