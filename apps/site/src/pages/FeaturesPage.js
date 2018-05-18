import { Header, Footer } from '~/components'
import {
  Border,
  Title,
  P,
  P2,
  Cmd,
  DottedButton,
  FadedArea,
  LeftSide,
  SubTitle,
  RightSide,
  Callout,
  Notification,
  SmallTitle,
  Glow,
} from '~/views'
import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { Section, Slant, SectionContent } from '~/views/section'
import * as Constants from '~/constants'
import Media from 'react-media'
import Observer from '@researchgate/react-intersection-observer'
import { Trail, Spring, animated, config } from 'react-spring'
import intelligenceImg from '~/../public/screen-context-word.png'
import newsImg from '~/../public/screen-home.png'
import searchImg from '~/../public/screen-slack-search.png'

const sleep = ms => new Promise(res => setTimeout(res, ms))
const blueBg = UI.color('#FAFAFF')
const blueTheme = {
  background: blueBg,
  color: '#222',
  titleColor: blueBg.darken(0.75).desaturate(0.3),
  subTitleColor: blueBg.darken(0.6).desaturate(0.8),
}

@view
class FeaturesIntro {
  render() {
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <Section>
            <SectionContent halfscreen css={{ padding: [0, 100] }}>
              <LeftSide noPad css={{ paddingTop: 60, textAlign: 'left' }}>
                <section css={{ justifyContent: 'center', height: '100%' }}>
                  <SmallTitle>Features</SmallTitle>
                  <Title italic size={3} margin={[0, 0, 10, -5]}>
                    Making work clearer, more organized, and more enjoyable
                  </Title>
                  <P size={isLarge ? 1.7 : 1.5} alpha={0.75}>
                    Smart contextual search, news and answers.
                  </P>
                </section>
              </LeftSide>
              <RightSide noEdge>
                <div $$flex />
                <div $$row>
                  <div $$flex />
                  <form css={{ width: 300 }}>
                    Signup for the beta
                    <UI.Input borderWidth={1} borderColor="#333" />
                  </form>
                </div>
              </RightSide>
            </SectionContent>
          </Section>
        )}
      </Media>
    )
  }
}

const SearchIllustration = () => (
  <Media
    query={Constants.screen.large}
    render={() => (
      <searchIllustration
        css={{
          position: 'absolute',
          overflow: 'hidden',
          left: '50%',
          top: '50%',
          marginLeft: 'calc(-5% - 520px)',
          width: 550,
          height: 380,
          marginBottom: -450,
          zIndex: 0,
          pointerEvents: 'none',
          transform: {
            y: searchYOff - 200,
          },
        }}
      >
        <FadedArea fadeRight fadeDown fadeBackground="#fff">
          <img
            src={searchImg}
            css={{
              width: 1150,
              marginTop: 0,
              height: 'auto',
              transformOrigin: 'top left',
              transform: { scale: 0.5, x: 0, y: 20 },
            }}
          />
        </FadedArea>
      </searchIllustration>
    )}
  />
)

const newsTopOffPct = '33%'
const searchYOff = -10
const contextYOff = 160

const FeatureSubTitle = props => (
  <Media query={Constants.screen.large}>
    {isLarge => (
      <P2
        size={isLarge ? 1.7 : 1.4}
        alpha={0.6}
        css={{
          marginBottom: 30,
        }}
        {...props}
      />
    )}
  </Media>
)

const SearchCallout = ({ isLarge }) => (
  <Callout
    css={
      isLarge && {
        width: '85%',
        position: 'absolute',
        top: searchYOff - 55,
        left: '12%',
      }
    }
  >
    <P2 size={2}>
      Sort the cloud with fast local search that summarizes conversations.
    </P2>
    <P2 size={1.6}>
      It's NLP powered search for your cloud. With overviews of Slack
      conversations and aggregated profiles to make your cloud clear.
    </P2>
  </Callout>
)

@view
export class SectionFeatureNewsSearch extends React.Component {
  state = {
    showOrbit: false,
    showNotifs: true,
    items: [
      {
        title: 'Emily Parker',
        body: 'Book club is cancelled tomorrow',
      },
      {
        title: 'John G',
        body: 'Following up on the ad placement',
      },
      {
        title: 'Theresa Suzuki',
        body: 'Re: 2017 Year End Additional Info Request',
      },
      {
        title: 'Jarrod Reynolds',
        body: 'Thanks for your order from Hoefler & Co.',
      },
      {
        title: 'Zenefits',
        body: '[Final Reminder] Submit your May 5, 2018 - May',
      },
      {
        title: 'Audible',
        body: 'Get "Three Body Problem" from audible',
      },
    ],
  }

  handleIntersect = async ({ isIntersecting }) => {
    console.log('brief intersect', isIntersecting)
    if (!isIntersecting) {
      return
    }
    if (!this.state.showNotifs || this.state.showOrbit) {
      return
    }
    await sleep(1200)
    this.setState({ showNotifs: false })
    await sleep(1500)
    this.setState({ showOrbit: true })
  }

  render() {
    const { showOrbit, showNotifs } = this.state

    return (
      <UI.Theme theme={blueTheme}>
        <Media query={Constants.screen.large}>
          {isLarge => (
            <Section id="features" inverse>
              <SectionContent
                padded={!isLarge}
                css={!isLarge && { paddingBottom: 0 }}
                fullscreen={isLarge}
              >
                <Glow style={{ transform: { y: '-10%', x: '-40%' } }} />
                <Glow style={{ transform: { y: '130%' } }} />
                <Slant
                  slantSize={10}
                  inverseSlant
                  slantBackground={`linear-gradient(200deg, #f2f2f2 5%, ${
                    Constants.featuresSlantColor
                  } 95%)`}
                />
                <Slant
                  slantSize={10}
                  css={{ zIndex: 1 }}
                  amount={20}
                  slantBackground={`linear-gradient(200deg, ${Constants.colorSecondary.alpha(
                    0.4,
                  )} 5%, ${Constants.featuresSlantColor
                    .desaturate(0.5)
                    .alpha(0.1)} 95%)`}
                />
                <LeftSide css={{ top: 0 }}>
                  <Observer onChange={this.handleIntersect}>
                    <content
                      css={{
                        display: 'block',
                        marginTop: isLarge ? newsTopOffPct : 0,
                      }}
                    >
                      <SubTitle size={3}>Daily Summary</SubTitle>
                      <FeatureSubTitle
                        css={{
                          marginTop: 12,
                        }}
                      >
                        Unify your cloud with <Cmd>⌘+Space</Cmd>
                      </FeatureSubTitle>
                      <Callout
                        css={{
                          textAlign: 'left',
                          ...(isLarge
                            ? {
                                width: '85%',
                                position: 'absolute',
                                right: '6%',
                              }
                            : null),
                        }}
                      >
                        <P2 size={2}>
                          Summarized news personalized to you, always at your
                          fingertips.
                        </P2>
                        <P2 size={1.6}>
                          A newspaper that sums up the day for you and your
                          team. Using novel on-device machine learning that
                          learns your company vocab.
                        </P2>
                        <DottedButton
                          css={
                            isLarge
                              ? {
                                  fontSize: 15,
                                  position: 'absolute',
                                  bottom: 20,
                                  right: 20,
                                }
                              : {
                                  margin: [20, 0, 0, 'auto'],
                                }
                          }
                        >
                          Learn more
                        </DottedButton>
                      </Callout>
                    </content>
                  </Observer>
                </LeftSide>

                <RightSide
                  inverse
                  css={{ zIndex: 1, overflow: 'hidden', top: 0, bottom: 0 }}
                >
                  <section
                    if={isLarge}
                    css={{
                      position: 'absolute',
                      top: newsTopOffPct,
                      marginTop: '-30%',
                      right: '6%',
                      left: '5%',
                      height: '60%',
                      maxHeight: 800,
                      overflow: 'hidden',
                    }}
                  >
                    <notifications
                      css={{
                        position: 'absolute',
                        top: 50,
                        left: '20%',
                        right: 0,
                        bottom: 0,
                      }}
                      if={isLarge}
                    >
                      <Trail
                        native
                        from={{ opacity: 1, x: 0 }}
                        config={config.fast}
                        to={{
                          opacity: showNotifs ? 1 : 0,
                          x: showNotifs ? 0 : 100,
                        }}
                        keys={this.state.items.map((_, index) => index)}
                      >
                        {this.state.items.map(
                          ({ title, body }) => ({ x, opacity }) => (
                            <animated.div
                              style={{
                                opacity,
                                transform: x.interpolate(
                                  x => `translate3d(${x}%,0,0)`,
                                ),
                              }}
                            >
                              <Notification title={title} body={body} />
                            </animated.div>
                          ),
                        )}
                      </Trail>
                    </notifications>
                    <Spring
                      if={showOrbit}
                      native
                      from={{ opacity: 0, x: 100 }}
                      to={{ opacity: 1, x: 0 }}
                      config={config.slow}
                    >
                      {({ opacity, x }) => (
                        <animated.div
                          style={{
                            opacity,
                            transform: x
                              ? x.interpolate(x => `translate3d(${x}%,0,0)`)
                              : null,
                          }}
                        >
                          <img
                            src={newsImg}
                            css={{
                              position: 'absolute',
                              top: 55,
                              right: -650,
                              width: 1100,
                              height: 'auto',
                              transformOrigin: 'top left',
                              border: [1, '#ddd'],
                              transform: {
                                scale: 0.4,
                              },
                              boxShadow: [[0, 15, 150, [200, 200, 200, 0.1]]],
                            }}
                          />
                        </animated.div>
                      )}
                    </Spring>
                    <fadeRight
                      css={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        right: 0,
                        width: '20%',
                        zIndex: 100,
                        background: `linear-gradient(to right, transparent, ${
                          Constants.backgroundColor
                        })`,
                      }}
                    />
                    <fadeawayfadeawayfadeaway
                      css={{
                        position: 'absolute',
                        bottom: -250,
                        right: -250,
                        width: 900,
                        height: 450,
                        background: Constants.backgroundColor,
                        borderRadius: 1000,
                        filter: {
                          blur: 30,
                        },
                        transform: {
                          z: 0,
                        },
                        zIndex: 2,
                      }}
                    />
                  </section>

                  <div if={isLarge} css={{ height: '100%' }} />
                  <content
                    css={
                      isLarge && {
                        display: 'block',
                        position: 'relative',
                        zIndex: 1000,
                        marginTop: -185 + searchYOff,
                      }
                    }
                  >
                    <SubTitle size={3}>Smart Search</SubTitle>
                    <FeatureSubTitle>
                      Spotlight, meet your brain
                    </FeatureSubTitle>
                  </content>
                  <Media
                    query={Constants.screen.small}
                    render={() => <SearchCallout />}
                  />
                </RightSide>
              </SectionContent>
            </Section>
          )}
        </Media>
      </UI.Theme>
    )
  }
}

@view
export class SectionFeatureIntelligence extends React.Component {
  state = {
    isIntersecting: false,
  }

  handleIntersect = ({ isIntersecting }) => {
    this.setState({ isIntersecting })
  }

  render() {
    const { isIntersecting } = this.state
    console.log('isIntersecting', isIntersecting)
    return (
      <UI.Theme theme={blueTheme}>
        <Media query={Constants.screen.large}>
          {isLarge => (
            <Section>
              <SectionContent fullscreen={isLarge} padded>
                <Glow style={{ transform: { y: '30%' } }} />
                <Slant
                  slantSize={10}
                  css={{ zIndex: 2 }}
                  slantBackground={`linear-gradient(200deg, ${
                    Constants.featuresSlantColor
                  } 5%, ${Constants.altBg.darken(0.05)} 95%)`}
                />
                <Slant
                  slantSize={10}
                  inverseSlant
                  css={{ zIndex: 1 }}
                  amount={20}
                  slantBackground={`linear-gradient(200deg, ${Constants.featuresSlantColor
                    .desaturate(0.5)
                    .alpha(0.1)} 5%, ${Constants.backgroundColor} 95%)`}
                />
                <LeftSide inverse innerStyle={{ paddingTop: '45%' }}>
                  <div
                    css={
                      isLarge && {
                        display: 'block',
                        margin: [contextYOff - 130, 0, 0, 30],
                      }
                    }
                  >
                    <SubTitle size={3}>Contextual Answers</SubTitle>
                    <FeatureSubTitle>
                      A whole new way to compute
                    </FeatureSubTitle>
                    <Callout
                      css={{
                        textAlign: 'left',
                        ...(isLarge
                          ? {
                              width: '86%',
                              position: 'absolute',
                              right: 10,
                            }
                          : null),
                      }}
                    >
                      <P2 size={2}>
                        Realtime contextual answers that work with every app
                        (yes, even Slack, Intercom, and your Mail client).
                      </P2>
                      <P2 size={1.6}>
                        And all you have to do is hold <Cmd>Option</Cmd>.
                        Important terms, people, and items in your cloud with
                        summarized answers, instantly.
                      </P2>
                      <DottedButton
                        css={
                          isLarge
                            ? {
                                fontSize: 15,
                                position: 'absolute',
                                bottom: 20,
                                right: 20,
                              }
                            : {
                                margin: [20, 0, 0, 'auto'],
                              }
                        }
                      >
                        Learn more
                      </DottedButton>
                    </Callout>
                    <Observer onChange={this.handleIntersect}>
                      <br />
                    </Observer>
                  </div>
                </LeftSide>

                <Media
                  query={Constants.screen.large}
                  render={() => (
                    <React.Fragment>
                      <RightSide css={{ top: 0, overflow: 'visible' }}>
                        <SearchCallout isLarge />
                      </RightSide>
                      <section
                        css={{
                          zIndex: 0,
                          position: 'absolute',
                          width: 500,
                          height: 420,
                          marginTop: -250 + contextYOff,
                          top: '50%',
                          left: '50%',
                          marginLeft: 50,
                          overflow: 'hidden',
                        }}
                      >
                        <FadedArea fadeLeft>
                          <Spring from={{ x: 100 }} to={{ x: 10 }}>
                            {({ x }) => (
                              <animated.div
                                style={{
                                  transform: `translate3d(${x}px,0,0)`,
                                }}
                              >
                                <img
                                  src={intelligenceImg}
                                  css={{
                                    position: 'absolute',
                                    width: 1634,
                                    height: 'auto',
                                    transformOrigin: 'top left',
                                    transform: {
                                      scale: 0.35,
                                      x: -350,
                                      y: 0,
                                    },
                                  }}
                                />
                              </animated.div>
                            )}
                          </Spring>
                        </FadedArea>
                      </section>
                    </React.Fragment>
                  )}
                />
              </SectionContent>
            </Section>
          )}
        </Media>
      </UI.Theme>
    )
  }
}

@view
export default class FeaturesPage {
  render() {
    return (
      <React.Fragment>
        <Header />
        <FeaturesIntro />
        <surround css={{ position: 'relative' }}>
          <Border css={{ top: 0, zIndex: 1 }} />
          <SectionFeatureNewsSearch />
          <SearchIllustration />
          <SectionFeatureIntelligence />
        </surround>
        <Footer />
      </React.Fragment>
    )
  }
}
