import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Section, SectionContent, Slant } from '~/views/section'
import { Header } from '~/components'
import { Title, P, P2, LeftSide, AppleLogo } from '~/views'
import girlImg from '~/../public/video-girl.jpg'
import HomeIllustration from './HomeIllustration'
import * as Constants from '~/constants'
import Media from 'react-media'
import Router from '~/router'

@view
class HomeHeader {
  render() {
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <Section css={{ background: '#fff' }}>
            <SectionContent padded={!isLarge} fullscreen>
              <Slant
                inverseSlant
                slantGradient={[
                  Constants.colorSecondary,
                  Constants.colorSecondary.lighten(0.4),
                ]}
                slantSize={12}
                amount={20}
              />
              <Slant slantBackground={`#f6f6f6`} css={{ zIndex: 2 }} />
              <div $$flex />
              <Media query={Constants.screen.large}>
                {isLarge => (
                  <mainSection $smallCallout={!isLarge} $largeCallout={isLarge}>
                    <Title
                      italic
                      size={isLarge ? 6.5 : 4}
                      margin={[-15, 0, -15, -5]}
                      color="#333"
                    >
                      Intelligent<br />
                      for you
                    </Title>
                    <line
                      css={{
                        margin: [30, 40, 20],
                        width: '53%',
                        height: 4,
                        background: '#ddd',
                        opacity: 0.15,
                      }}
                    />
                    <below css={{ margin: [0, '24%', 10, 0] }}>
                      <P size={2} fontWeight={300} alpha={0.8}>
                        A smart new way to operate your company by bringing the
                        cloud down to your OS.
                      </P>
                    </below>
                    <actions
                      $$row
                      css={{
                        margin: isLarge ? [25, 'auto', 0, 0] : [0, 0, 0, 25],
                        alignItems: 'center',
                      }}
                    >
                      <UI.Button
                        borderStyle="dotted"
                        borderColor="#ccc"
                        size={1.1}
                        $smallInstallBtn={!isLarge}
                        tooltip=""
                        css={{
                          margin: [0, 10, 0, 0],
                        }}
                      >
                        Try for{' '}
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
                      >
                        Learn more
                      </UI.Button>
                    </actions>
                  </mainSection>
                )}
              </Media>
              <div $$flex />
              <Media
                query={Constants.screen.large}
                render={() => (
                  <React.Fragment>
                    <rightSide>
                      <HomeIllustration />
                    </rightSide>
                    <videos if={false}>
                      <videoSpot>
                        <img
                          $girlImg
                          src={girlImg}
                          width={432}
                          css={{ transform: { scale: 0.9 } }}
                        />
                        <UI.Icon
                          name="media-1_button-play"
                          color="#fff"
                          size={45}
                          css={{
                            zIndex: 100,
                            position: 'absolute',
                            top: 120,
                            left: 200,
                          }}
                        />
                        <P selectable={false} size={4.5} margin={0}>
                          Watch the 30s<br /> introduction
                        </P>
                      </videoSpot>
                    </videos>
                  </React.Fragment>
                )}
              />
            </SectionContent>
          </Section>
        )}
      </Media>
    )
  }

  static style = {
    mainSection: {
      position: 'relative',
      zIndex: 10,
    },
    smallCallout: {
      padding: [10, 0, 40, 0],
    },
    largeCallout: {
      width: '54%',
      margin: [-15, 0, 0, 0],
    },
    smallInstallBtn: {
      transformOrigin: 'top right',
      transform: {
        scale: 1.2,
      },
    },
    videoSpot: {
      cursor: 'pointer',
      flexFlow: 'row',
      alignItems: 'center',
      transformOrigin: 'center center',
      transform: { scale: 0.22 },
      transition: 'all linear 100ms',
      '&:hover': { transform: { scale: 0.23 } },
    },
    girlImg: {
      margin: [0, 60, 0, 0],
      boxShadow: [[0, 0, 90, [0, 0, 0, 0.1]]],
    },
    brandMark: {
      alignSelf: 'flex-end',
      alignItems: 'center',
      textAlign: 'center',
      marginRight: 20,
    },
    title: {
      fontSize: 40,
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
      overflow: 'hidden',
      left: '50%',
      paddingLeft: '5%',
      zIndex: 4,
      pointerEvents: 'none',
    },
    videos: {
      position: 'absolute',
      top: -22,
      right: 100,
      width: 200,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      [Constants.screen.smallQuery]: {
        position: 'relative',
        width: 'auto',
      },
    },
  }
}

const blackBg = UI.color('#111')
const blackTheme = {
  background: blackBg,
  color: '#f2f2f2',
  titleColor: blackBg.darken(0.75).desaturate(0.3),
  subTitleColor: blackBg.darken(0.6).desaturate(0.8),
}

@view
class HomeFooter {
  render() {
    return (
      <UI.Theme theme={blackTheme}>
        <Media query={Constants.screen.large}>
          {isLarge => (
            <Section inverse>
              <SectionContent padded={!isLarge} fullscreen>
                <Slant
                  css={{ zIndex: 1 }}
                  slantSize={10}
                  inverseSlant
                  slantGradient={['#222', '#333']}
                />
                <Slant
                  slantSize={10}
                  amount={20}
                  slantGradient={[
                    Constants.colorSecondary.lighten(0.4),
                    Constants.colorSecondary.darken(0.2),
                  ]}
                />
                <LeftSide css={{ textAlign: 'left' }}>
                  <div css={{ height: '22%' }} />
                  <Title italic size={2.8} color="#fff">
                    A brain for your company
                  </Title>
                  <below css={{ margin: [20, '15%', 0, 0] }}>
                    <P2 size={2.1} alpha={0.8}>
                      We use more and more tools everyday. They store data all
                      over the place.
                    </P2>
                    <P2 size={1.8} alpha={0.7}>
                      It makes sense to use best tool for the job. But that
                      leads to a lack of high level organization.
                    </P2>
                    <P2 size={1.8} alpha={0.7}>
                      Orbit brings company news, search and exploratory features
                      to your desktop by giving it a powerful on-device machine
                      learning system and a whole new interface.
                    </P2>
                  </below>
                </LeftSide>
              </SectionContent>
            </Section>
          )}
        </Media>
      </UI.Theme>
    )
  }
}

export default () => (
  <React.Fragment>
    <Header />
    <HomeHeader />
    <HomeFooter />
  </React.Fragment>
)
