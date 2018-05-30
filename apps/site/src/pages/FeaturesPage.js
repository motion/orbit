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
  TopoBg,
  RightSide,
  Callout,
  Notification,
  Glow,
  HalfSection,
  Section,
  Slant,
} from '~/views'
import SectionContent from '~/views/sectionContent'
import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import * as Constants from '~/constants'
import Media from 'react-media'
import Observer from '@researchgate/react-intersection-observer'
import { Trail, Spring, animated, config } from 'react-spring'
import intelligenceImg from '~/../public/screen-context-word.png'
import newsImg from '~/../public/screen-home.png'
import searchImg from '~/../public/screen-slack-search.png'
import { scrollTo } from '~/helpers'

const sleep = ms => new Promise(res => setTimeout(res, ms))
const background = UI.color('#F5E2D5')
const theme = {
  background: background,
  color: background.darken(0.5).desaturate(0.9),
  titleColor: background.darken(0.65).desaturate(0.7),
  subTitleColor: '#111',
}

const slantBg = background

const FeatureTitle = props => (
  <Title italic size={3.5} css={{ marginBottom: 20 }} {...props} />
)

@UI.injectTheme
@view
class FeaturesIntro extends React.Component {
  render({ theme }) {
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <Section css={{ background: 'transparent' }}>
            <SectionContent padded fullscreen css={{ marginTop: -400 }}>
              <Slant
                slantBackground={slantBg.darken(0.05)}
                css={{ zIndex: 2 }}
              />
              <HalfSection css={{ position: 'absolute', bottom: 100 }}>
                <Title
                  color="#111"
                  italic
                  size={2.3}
                  margin={[0, '10%', 10, 0]}
                >
                  The intelligent agent for company operation.
                </Title>
                <P2 size={1.6} alpha={0.75}>
                  Orbit unifies knowledge from across the cloud and lets your
                  teams use it effectively.
                </P2>
                <P size={1.2} alpha={0.9} fontWeight={500}>
                  <a onClick={scrollTo('#news')}>News</a>{' '}
                  &nbsp;&nbsp;&middot;&nbsp;&nbsp;
                  <a onClick={scrollTo('#search')}>Search</a>
                  &nbsp;&nbsp;&middot;&nbsp;&nbsp;
                  <a onClick={scrollTo('#context')}>Answers</a>
                </P>
              </HalfSection>
              <HalfSection />
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
          zIndex: 1,
          pointerEvents: 'none',
          transform: {
            y: searchYOff - 190,
          },
        }}
      >
        <FadedArea fadeRight fadeDown>
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

const newsTopOffPct = '29%'
const searchYOff = -10
const contextYOff = 160

const SearchCallout = ({ isLarge }) => (
  <UI.Theme name="light">
    <Callout
      css={
        isLarge && {
          width: '80%',
          position: 'absolute',
          top: searchYOff - 75,
          left: '12%',
        }
      }
    >
      <P size={1.6}>
        Search the entire cloud with keyword summaries of all conversations,
        adjusted to important terms specific to your company.
        <br />
        <br />Aggregated profiles of everyone you interact with lets you avoid
        interruptions and explore your team.
      </P>
    </Callout>
  </UI.Theme>
)

@UI.injectTheme
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
    const { theme } = this.props
    const { showOrbit, showNotifs } = this.state

    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <Section css={{ background: 'transparent' }} id="features" inverse>
            <SectionContent
              id="news"
              padded={!isLarge}
              css={!isLarge && { paddingBottom: 0, overflow: 'visible' }}
              fullscreen={isLarge}
            >
              <Glow
                if={false}
                style={{ transform: { y: '-10%', x: '-40%' } }}
              />
              <Glow if={false} style={{ transform: { y: '130%', x: '60%' } }} />
              <Slant
                inverseSlant
                slantSize={14}
                slantBackground={slantBg.darken(0.05)}
              />
              <LeftSide css={{ top: 0 }}>
                <Observer onChange={this.handleIntersect}>
                  <content
                    css={{
                      display: 'block',
                      marginTop: isLarge ? newsTopOffPct : 0,
                    }}
                  >
                    <FeatureTitle>Company news</FeatureTitle>
                    <UI.Theme name="light">
                      <Callout
                        css={{
                          textAlign: 'left',
                          ...(isLarge
                            ? {
                                width: '95%',
                                position: 'absolute',
                                right: '6%',
                              }
                            : null),
                        }}
                      >
                        <P size={1.6}>
                          A heads up display for all your incoming. Sorted by
                          what you've been interested in recently.
                          <br />
                          <br />
                          With novel on-device ML, Orbit adjusts to what you
                          care about and the custom terminology your team uses.
                        </P>
                        <DottedButton
                          css={{
                            margin: [0, 0, 0, 'auto'],
                          }}
                        >
                          Learn more
                        </DottedButton>
                      </Callout>
                    </UI.Theme>
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
                    marginTop: -210,
                    right: 0,
                    left: '16%',
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
                            // right: -650,
                            // width: 1100,
                            // height: 'auto',
                            transformOrigin: 'top left',
                            border: [1, '#ddd'],
                            transform: {
                              scale: 0.5,
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
                      width: '10%',
                      zIndex: 100,
                      background: `linear-gradient(to right, transparent, ${
                        theme.base.background
                      })`,
                    }}
                  />
                  <fadeawayfadeawayfadeaway
                    css={{
                      position: 'absolute',
                      bottom: -300,
                      right: -250,
                      width: 900,
                      height: 450,
                      background: theme.base.background,
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
                  id="search"
                  css={
                    isLarge && {
                      display: 'block',
                      position: 'relative',
                      zIndex: 1000,
                      marginTop: -145 + searchYOff,
                    }
                  }
                >
                  <FeatureTitle>Unified search</FeatureTitle>
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
    )
  }
}

@UI.injectTheme
@view
export class SectionFeatureIntelligence extends React.Component {
  state = {
    isIntersecting: false,
  }

  handleIntersect = ({ isIntersecting }) => {
    this.setState({ isIntersecting })
  }

  render() {
    const { theme } = this.props
    const { isIntersecting } = this.state
    console.log('isIntersecting', isIntersecting)
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <Section css={{ background: 'transparent' }}>
            <SectionContent id="context" fullscreen={isLarge} padded>
              <Glow if={false} style={{ transform: { y: '10%', x: '-55%' } }} />
              <Slant
                css={{ zIndex: 2 }}
                slantSize={14}
                slantBackground={slantBg.darken(0.05)}
              />
              <LeftSide inverse innerStyle={{ paddingTop: '50%' }}>
                <div
                  css={
                    isLarge && {
                      display: 'block',
                      margin: [contextYOff - 130, 0, 0, 30],
                    }
                  }
                >
                  <FeatureTitle>Realtime answers</FeatureTitle>
                  <UI.Theme name="light">
                    <Callout
                      css={{
                        textAlign: 'left',
                        ...(isLarge
                          ? {
                              width: '95%',
                              position: 'absolute',
                              right: '8%',
                            }
                          : null),
                      }}
                    >
                      <P2 size={1.6}>
                        A sidebar that shows relevant answers from your
                        knowledgebase alongside every app.
                      </P2>
                      <P2 size={1.6}>
                        Simply hold <Cmd>Option</Cmd> or press{' '}
                        <Cmd>Option+Space</Cmd>. Important terms, people, and
                        conversations are highlighted and summarized, instantly.
                      </P2>
                      <DottedButton
                        css={{
                          margin: [0, 0, 0, 'auto'],
                        }}
                      >
                        Learn more
                      </DottedButton>
                    </Callout>
                  </UI.Theme>
                  <Observer onChange={this.handleIntersect}>
                    <br />
                  </Observer>
                </div>
              </LeftSide>

              <Media
                query={Constants.screen.large}
                render={() => (
                  <>
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
                      }}
                    >
                      <Border
                        css={{
                          bottom: -2,
                          zIndex: 10000,
                        }}
                      />
                      <inner css={{ flex: 1, overflow: 'hidden' }}>
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
                      </inner>
                    </section>
                  </>
                )}
              />
            </SectionContent>
          </Section>
        )}
      </Media>
    )
  }
}

@view
export class FeaturesPage extends React.Component {
  render() {
    return (
      <features $$flex $$background={background}>
        <UI.Theme theme={theme}>
          <TopoBg />
          <Header />
          <FeaturesIntro />
          <surround css={{ position: 'relative' }}>
            <SectionFeatureNewsSearch />
            <SearchIllustration />
            <SectionFeatureIntelligence />
          </surround>
          <Footer />
        </UI.Theme>
      </features>
    )
  }
}
