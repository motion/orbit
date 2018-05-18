import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Section, SectionContent, Slant } from '~/views/section'
import { Header } from '~/components'
import { Title, P, P2, AppleLogo } from '~/views'
import girlImg from '~/../public/video-girl.jpg'
import HomeIllustration from './HomeIllustration'
import * as Constants from '~/constants'
import Media from 'react-media'
import Router from '~/router'

@view
class Home {
  render() {
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <Section css={{ background: '#fff' }}>
            <SectionContent padded={!isLarge} fullscreenFixed>
              <Slant
                inverseSlant
                slantBackground={`linear-gradient(200deg, ${
                  Constants.colorSecondary
                } 5%, ${Constants.colorSecondary.alpha(0.4)} 95%)`}
                slantSize={12}
                amount={20}
              />
              <Slant
                slantBackground={`linear-gradient(200deg, ${
                  Constants.backgroundColor
                } 5%, #f2f2f2 95%)`}
                css={{ zIndex: 2 }}
              />
              <div $$flex />
              <Media query={Constants.screen.large}>
                {isLarge => (
                  <mainSection $smallCallout={!isLarge} $largeCallout={isLarge}>
                    <Title
                      italic
                      reduceCapsPct={10}
                      size={isLarge ? 7.2 : 4}
                      margin={[-15, 0, -15, -5]}
                    >
                      Work smart
                    </Title>
                    <line
                      css={{
                        margin: [26, 40],
                        width: '60%',
                        height: 4,
                        background: '#ddd',
                        opacity: 0.15,
                      }}
                    />
                    <P
                      size={isLarge ? 1.9 : 1.5}
                      alpha={0.75}
                      margin={[0, '25%', 15, 0]}
                      css={{
                        lineHeight: '36px',
                      }}
                    >
                      Your cloud and your Mac meet.<br />
                      An intelligent new operating layer.
                    </P>

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
                          margin: [0, 10, 0, -5],
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
                        onClick={Router.link('/features')}
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

export default () => (
  <React.Fragment>
    <Header />
    <Home />
  </React.Fragment>
)
