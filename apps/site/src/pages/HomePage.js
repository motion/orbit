import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Header, Footer, Join } from '~/components'
import SectionContent from '~/views/sectionContent'
import Router from '~/router'
import {
  Section,
  Slant,
  Title,
  P,
  P2,
  LeftSide,
  RightSide,
  AppleLogo,
  TopoBg,
  HomeImg,
  WindowsLogo,
  Glow,
  Card,
} from '~/views'
// import { HomePlay } from './home/HomePlay'
import * as Constants from '~/constants'
import Media from 'react-media'
import { scrollTo } from '~/helpers'
import bg from '~/../public/girl.svg'
import { Bauhaus } from '~/views/bauhaus'

const topBg = Constants.colorMain // '#D6B190' //'#E1D1C8'
const bottomBg = Constants.colorMain.lighten(0.1).desaturate(0.1)

const scrollToTrack = (to, track) => {
  return () => {
    window.ga('send', 'event', 'Home', 'download', track)
    scrollTo(to)()
  }
}

const borderize = bg => bg.darken(0.2).alpha(0.5)
const topSlants = {
  slantGradient: [topBg, borderize(bottomBg.mix(topBg))],
}
const bottomSlants = {
  slantGradient: [borderize(bottomBg.mix(topBg)), topBg],
}

const firstSlant = {
  slantSize: 1,
  amount: 40,
  css: { zIndex: 2 },
}
const secondSlant = {
  slantSize: 1,
  amount: 10,
  css: { zIndex: 2 },
}
const thirdSlant = {
  slantSize: 1,
  amount: 18,
}

class HomeStore {
  stars = null

  didMount() {
    // this.on(
    //   window,
    //   'scroll',
    //   throttle(() => {
    //     const max = window.innerHeight * 3
    //     // 0 - 1 of how far down we are
    //     const pctDown =
    //       (max - (max - document.scrollingElement.scrollTop)) / max
    //     const offset = pctDown * 30
    //     // this.stars.stopAnimation()
    //     this.stars(Spring, {
    //       to: { y: -offset },
    //     })
    //   }, 100),
    // )
    // setTimeout(() => {
    //   this.stars(Spring, {
    //     to: { y: 0 },
    //   })
    // })
  }
}

const Pitch = ({ isLarge }) => (
  <>
    <Title italic size={3.7} margin={[0, 0, 15, 0]} alpha={1} color="#222">
      Org(anizational) Excellence
    </Title>
    <P size={1.38} sizeLineHeight={1.2} fontWeight={300}>
      Turn docs, tickets and chats into a knowledgebase with a daily digest,
      teams, people and unified search.<br />
      Installed in 3 minutes.
    </P>
    <homeJoin css={{ margin: [20, -15, -30] }}>
      <Join />
    </homeJoin>
    <actions
      if={false}
      $$row
      css={{
        margin: isLarge ? [25, 'auto', 0, 0] : [20, 0, 0, 0],
        alignItems: 'center',
      }}
    >
      <UI.Text alpha={0.8}>
        Coming soon for
        <AppleLogo
          onClick={scrollToTrack('#join', 'Mac')}
          width={15}
          height={15}
          css={{
            fill: '#999',
            display: 'inline-block',
            margin: [-3, 4, 0],
            opacity: 0.9,
          }}
        />
        and
        <WindowsLogo
          onClick={scrollToTrack('#join', 'Windows')}
          width={13}
          height={13}
          css={{
            opacity: 0.9,
            display: 'inline-block',
            margin: [-1, 3, 0, 6],
            filter: 'grayscale(100%)',
          }}
        />
        .
      </UI.Text>
      <space css={{ width: 15 }} />
      <UI.Button
        href="/about"
        onClick={Router.link('/about')}
        css={{ cursor: 'pointer' }}
      >
        Learn more.
      </UI.Button>
    </actions>
  </>
)

@view({
  store: HomeStore,
})
class HomeHeader extends React.Component {
  render({ isMedium }) {
    return (
      <Media query={Constants.screen.large}>
        {isLarge => {
          return (
            <Section css={{ background: 'transparent' }}>
              {/* <parallax css={{ overflow: 'hidden' }} $$fullscreen>
                <parallaxContain $$fullscreen>
                  <Keyframes native script={ref => (store.stars = ref)}>
                    {({ y }) => (
                      <animated.div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          transform: y.interpolate(
                            y => `translate3d(0,${y}%,0)`,
                          ),
                        }}
                      >
                        <inner $$fullscreen />
                      </animated.div>
                    )}
                  </Keyframes>
                </parallaxContain>
              </parallax> */}
              <Slant {...firstSlant} {...topSlants} />
              <Slant inverseSlant {...secondSlant} {...topSlants} />
              <Slant {...thirdSlant} {...topSlants} />
              <SectionContent padded fullscreen fullscreenFs>
                <Glow
                  style={{
                    background: '#fff',
                    opacity: 0.5,
                    transform: { x: '-45%', y: '0%', scale: 0.65 },
                  }}
                />
                <Bauhaus
                  hideTriangle
                  hideSquare
                  circleColor="#F7C7FF"
                  css={{ transform: { scale: 0.97, y: '-11%', x: '54%' } }}
                  warp={([x, y]) => [x, y - 4 * -Math.sin(x / 50)]}
                />
                <Media
                  query={Constants.screen.small}
                  render={() => (
                    <>
                      <div $$flex />
                      <Pitch />
                      <div $$flex />
                    </>
                  )}
                />
                <Media
                  query={Constants.screen.large}
                  render={() => (
                    <>
                      <LeftSide noEdge>
                        <inner
                          $$fullscreen
                          css={{
                            textAlign: 'left',
                            padding: [0, 80, 0, 0],
                          }}
                        >
                          <div $$flex={1.2} />
                          <Pitch isLarge />
                          <div $$flex />
                        </inner>
                      </LeftSide>
                      <RightSide noEdge>
                        <inner
                          $$fullscreen
                          css={{
                            overflow: 'hidden',
                            right: -160,
                            left: 20,
                            borderBottom: [1, borderize(topBg)],
                          }}
                        >
                          <inner
                            css={{
                              position: 'absolute',
                              right: 100,
                              left: 100,
                              top: 0,
                              bottom: 0,
                            }}
                          >
                            <wrap
                              css={{
                                width: 1100 / 2,
                                height: 2016 / 2,
                                transform: {
                                  x: 20,
                                  y: 100,
                                },
                              }}
                            >
                              <UI.TiltHoverGlow restingPosition={[100, 100]}>
                                <HomeImg />
                              </UI.TiltHoverGlow>
                            </wrap>
                          </inner>
                        </inner>
                      </RightSide>
                    </>
                  )}
                />
              </SectionContent>
            </Section>
          )
        }}
      </Media>
    )
  }

  static style = {
    paintingWrap: {
      background: '#000',
      left: '50.2%',
      right: '-10%',
      top: '-15%',
      bottom: '-15%',
      overflow: 'hidden',
      transform: {
        rotate: '4.3deg',
      },
    },
    painting: {
      opacity: 0.3,
      background: `url(${bg}) no-repeat top left`,
      backgroundSize: 'cover',
      bottom: '-10%',
      transform: {
        rotate: '-4.3deg',
        x: '-5%',
        y: '-10%',
      },
    },
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

@view
class HomeFooter extends React.Component {
  render() {
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <Section inverse css={{ background: 'transparent' }}>
            <SectionContent padded fullscreen fullscreenFs>
              <Bauhaus />
              <Slant inverseSlant {...firstSlant} {...bottomSlants} />
              <Slant {...secondSlant} {...bottomSlants} />
              <Slant inverseSlant {...thirdSlant} {...bottomSlants} />
              <LeftSide css={{ textAlign: 'left' }}>
                <inner $$fullscreen={isLarge}>
                  <div $$flex />
                  <content css={isLarge && { marginRight: 80 }}>
                    <Title size={2.5} color="#333" css={{ marginBottom: 25 }}>
                      A beautiful and secure intranet in just&nbsp;a few
                      minutes.
                    </Title>
                    <UI.PassProps size={1.9} sizeLineHeight={1.2} alpha={0.7}>
                      <P2>
                        Your team talks, documents and tickets at lightspeed.
                        It's hard to keep up.
                      </P2>
                      <P2>
                        Orbit makes everything easy to understand, sorting it
                        all into news, teams and profiles.
                      </P2>
                      <P2>
                        It works privately on the desktop so there's no complex
                        install or data security issues.
                      </P2>
                      <P2 size={1.6} css={{ marginTop: 5 }}>
                        <a
                          href="/about"
                          onClick={Router.link('about')}
                          css={{
                            textDecoration: 'none',
                            color: '#6858D3',
                            fontWeight: 500,
                          }}
                        >
                          Read more on how we're building it.
                        </a>
                      </P2>
                    </UI.PassProps>
                  </content>
                  <div $$flex />
                </inner>
              </LeftSide>
              <RightSide noEdge $$centered>
                <cards>
                  <UI.Theme name="light">
                    <Card css={isLarge && { transform: { x: -30 } }}>
                      <Card.Icon
                        name="business_bulb-61"
                        color="rgb(91.3%, 87%, 16.8%)"
                      />
                      <Card.Title>Works with you</Card.Title>
                      <Card.Body>
                        Orbit works with your existing tools to build an
                        automatic knowledgebase that doesn't go stale.
                      </Card.Body>
                    </Card>
                    <Card css={isLarge && { transform: { x: 30 } }}>
                      <Card.Icon name="users_single" color="blue" />
                      <Card.Title>Made for teams</Card.Title>
                      <Card.Body>
                        Beautiful profiles for people and teams that summarize
                        what's going on with tools to expose important things.
                      </Card.Body>
                    </Card>
                    <Card css={isLarge && { transform: { x: -30 } }}>
                      <Card.Icon name="chat" color="green" />
                      <Card.Title>Understands Slack</Card.Title>
                      <Card.Body>
                        Slack is part of your knowledge, too. Relevant
                        conversations you missed are summarized in your daily
                        digest.
                      </Card.Body>
                    </Card>
                  </UI.Theme>
                </cards>
              </RightSide>
            </SectionContent>
          </Section>
        )}
      </Media>
    )
  }
}

export const HomePage = () => (
  <UI.Theme
    theme={{ background: topBg, color: topBg.darken(0.6).desaturate(0.5) }}
  >
    <Media query={Constants.screen.medium}>
      {isMedium => (
        <home $$flex $$background={topBg}>
          <TopoBg />
          <Header white />
          <HomeHeader isMedium={isMedium} />
          <UI.Theme
            theme={{
              background: bottomBg,
              color: bottomBg.darken(0.8).desaturate(0.4),
            }}
          >
            <HomeFooter isMedium={isMedium} />
          </UI.Theme>
          <Footer />
        </home>
      )}
    </Media>
  </UI.Theme>
)
