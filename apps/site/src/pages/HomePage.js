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
  TopoBg,
} from '~/views'
import { HomePlay } from './home/HomePlay'
import * as Constants from '~/constants'
import Media from 'react-media'
import Router from '~/router'
import { scrollTo } from '~/helpers'
import bg from '~/../public/girl.svg'

const background = UI.color('#F7DFE5') // '#D6B190' //'#E1D1C8'
const borderColor = background.darken(0.1)

const firstSlant = {
  slantSize: 1,
  amount: 40,
  slantBackground: borderColor,
  css: { zIndex: 2 },
}
const secondSlant = {
  slantSize: 1,
  amount: 10,
  slantBackground: borderColor,
  css: { zIndex: 2 },
}
const thirdSlant = {
  slantBackground: borderColor,
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
    <Title italic size={2.7} margin={[0, 0, 20, 0]}>
      Smarter<br />Knowledge<br />Management
    </Title>
    <P size={1.6} sizeLineHeight={1.15} fontWeight={300} alpha={0.9}>
      Augment team knowledge with an intelligent desktop app that organizes your
      company.
    </P>
    <actions
      $$row
      css={{
        margin: isLarge ? [25, 'auto', 0, 0] : [20, 0, 0, 0],
        alignItems: 'center',
      }}
    >
      <UI.Button
        background="transparent"
        borderColor={[255, 255, 255, 0.45]}
        size={1.1}
        onClick={scrollTo('#join')}
        $smallInstallBtn={!isLarge}
        alpha={0.85}
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
            fill: background
              .darken(0.25)
              .desaturate(0.2)
              .toString(),
            display: 'inline-block',
            margin: [-2, 0, 0, 4],
            // opacity: 0.32,
          }}
        />
      </UI.Button>
      <UI.Button
        if={false}
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
              <borderBottom
                if={false}
                css={{
                  position: 'absolute',
                  bottom: 0,
                  left: '48.035%',
                  right: 0,
                  height: 6,
                  background: borderColor,
                  zIndex: 1000,
                }}
              />
              {/* <paintingOverflow css={{ overflow: 'hidden' }} $$fullscreen>
                <paintingWrap $$fullscreen>
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
                        <painting $$fullscreen />
                      </animated.div>
                    )}
                  </Keyframes>
                </paintingWrap>
              </paintingOverflow> */}
              <Slant {...firstSlant} />
              <Slant inverseSlant {...secondSlant} />
              <Slant {...thirdSlant} />
              <SectionContent padded fullscreen fullscreenFs>
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
                      <leftSide
                        css={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          bottom: 0,
                          width: '50%',
                        }}
                      >
                        <HomePlay />
                      </leftSide>
                      <inner
                        css={{
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          right: '-100%',
                          padding: [180, 0, '10%', 55],
                          transformOrigin: 'top left',
                          transform: {
                            y: firstSlant.slantSize,
                            x: firstSlant.slantSize + 10,
                            rotate: '4.1deg',
                          },
                        }}
                      >
                        <innerInner
                          css={{
                            width: 460,
                            marginLeft: 20,
                            transform: {
                              rotate: '-4.1deg',
                            },
                          }}
                        >
                          <Pitch isLarge />
                        </innerInner>
                      </inner>
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
        {() => (
          <Section inverse css={{ background: 'transparent' }}>
            <SectionContent padded fullscreen fullscreenFs>
              <Slant inverseSlant {...firstSlant} />
              <Slant {...secondSlant} />
              <Slant inverseSlant {...thirdSlant} />
              <LeftSide css={{ textAlign: 'left' }}>
                <div css={{ height: '22%' }} />
                <below css={{ margin: [15, 0, 0, 0] }}>
                  <Title size={2.3} css={{ marginBottom: 20 }}>
                    Give your company an operating system.
                  </Title>
                  <UI.PassProps size={1.3} sizeLineHeight={1.1} alpha={0.85}>
                    <P2>
                      Conversations, tickets, emails, and wiki. Your knowledge
                      lives all over the place.
                    </P2>
                    <P2>
                      Orbit sorts your knowledge autonomously. It uses modern
                      NLP to curate and summarize answers on-demand. And it{' '}
                      <span css={{ fontWeight: 500, fontStyle: 'italic' }}>
                        works across every integration, and with any app
                      </span>.
                    </P2>
                    <P2>
                      It has no cloud setup or install process and runs{' '}
                      completely privately on your device so your data never
                      leaves your firewall.
                    </P2>
                    <P2>
                      It's a new way to operate. Currently in private beta.
                    </P2>
                  </UI.PassProps>
                </below>
              </LeftSide>
              <RightSide noEdge $$centered>
                <UI.Theme name="light">
                  <Join />
                </UI.Theme>
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
    theme={{ background, color: background.darken(0.6).desaturate(0.5) }}
  >
    <Media query={Constants.screen.medium}>
      {isMedium => (
        <home $$flex $$background={background}>
          <TopoBg />
          <Header white />
          <HomeHeader isMedium={isMedium} />
          <HomeFooter isMedium={isMedium} />
        </home>
      )}
    </Media>
  </UI.Theme>
)
