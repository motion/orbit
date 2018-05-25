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
                css={{
                  left: '50.2%',
                  right: '-100%',
                  top: '-10%',
                  bottom: '-10%',
                  overflow: 'hidden',
                  transform: {
                    rotate: '4.3deg',
                  },
                }}
              >
                <rightBg
                  $$fullscreen
                  css={{
                    background:
                      'url(https://backgrounds.wetransfer.net/riccav6_1680x1050.jpg) bottom left',
                    transform: {
                      rotate: '-4.3deg',
                      x: -500,
                      y: -100,
                    },
                  }}
                />
              </rightBackground>
              <SectionContent padded fullscreen>
                <inner
                  css={{
                    position: 'absolute',
                    bottom: '-5%',
                    left: '48.5%',
                    padding: [40, 45, 150, 55],
                    background: 'rgba(0,0,0,0.92)',
                    // border: [4, '#000'],
                    transform: {
                      rotate: '4deg',
                    },
                  }}
                >
                  <innerInner
                    css={{
                      width: 400,
                      transform: {
                        rotate: '-4deg',
                      },
                    }}
                  >
                    <Title
                      italic
                      size={isMedium ? 6 : 7}
                      margin={[0, 0, 20, 0]}
                      alpha={1}
                      color="#fff"
                    >
                      Rethink<br />Desktop
                    </Title>
                    <P
                      size={1.35}
                      sizeLineHeight={1.15}
                      fontWeight={300}
                      alpha={0.9}
                      color="#fff"
                    >
                      Orbit is a smart operating layer for Mac that keeps team
                      knowledge sorted and at hand.
                    </P>
                    <actions
                      if={false}
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
                  </innerInner>
                </inner>
                <Slant
                  slantSize={10}
                  amount={40}
                  slantBackground="#111"
                  css={{ zIndex: 0 }}
                />
                <leftSide
                  css={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '50%',
                  }}
                >
                  <Media
                    query={Constants.screen.large}
                    render={() => <HomeIllustration />}
                  />
                </leftSide>
                <rightSide />
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
      // background: '#fff',
    },
    smallCallout: {
      padding: [0, 0, 40, 0],
    },
    largeCallout: {
      position: 'absolute',
      top: 0,
      left: '55%',
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      // border: [1, [0, 0, 0, 0.04]],
      // padding: [60, 40],
      // margin: [-60, -40],
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
              <rightBackground
                $$fullscreen
                css={{
                  left: '55%',
                  background: '#fff',
                }}
              />
              <SectionContent padded fullscreen>
                <Slant
                  inverseSlant
                  slantSize={10}
                  amount={40}
                  rightBackground={'#fff'}
                  slantBackground="#111"
                  css={{ zIndex: 0 }}
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
                        A smarter way to stay up to date and in the know.
                      </P2>
                      <P2>
                        You and your team have knowledge all over. Orbit gives
                        you the tools and interface to put it to use. It unifies
                        cloud knowledge and gives it a brain.
                      </P2>
                      <P2>
                        Orbit wants to make your day to day more interpretable
                        and fluid. It's an app that you'll interact with often,
                        and it will touch your most sensitive data.
                      </P2>
                      <P2>
                        That's why it's{' '}
                        <span css={{ fontWeight: 500, fontStyle: 'italic' }}>
                          completely private and on-device
                        </span>. It's a new way to operate, so it has to work
                        for you.
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
        <Header
          linkStyle={{
            color: '#000',
            background: 'white',
          }}
        />
        <HomeHeader isMedium={isMedium} />
        <HomeFooter isMedium={isMedium} />
      </>
    )}
  </Media>
)
