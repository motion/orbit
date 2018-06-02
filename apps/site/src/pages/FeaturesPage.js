import { Header, Footer } from '~/components'
import {
  FeatureSubTitle,
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
  HomeImg,
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
import searchImg from '~/../public/screen-slack-search.png'
import { scrollTo } from '~/helpers'
import profileImg from '~/../public/screen-profile.png'

const sleep = ms => new Promise(res => setTimeout(res, ms))
const background = UI.color('#F6F5FA')
const theme = {
  background: background,
  color: background.darken(0.5).desaturate(0.9),
  titleColor: background.darken(0.65).desaturate(0.7),
  subTitleColor: '#111',
}

const slantBg = background

const FeatureTitle = props => (
  <Title italic size={2.6} css={{ marginBottom: 15 }} {...props} />
)

@UI.injectTheme
@view
class FeaturesIntro extends React.Component {
  render({ theme }) {
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <Section
            css={{
              background: 'transparent',
              marginTop: -window.innerHeight / 2,
            }}
          >
            <SectionContent padded fullscreen>
              <Slant
                slantBackground={slantBg.darken(0.05)}
                css={{ zIndex: 2 }}
              />
              <HalfSection>
                <div $$flex />
                <Title
                  color="#111"
                  italic
                  size={2.3}
                  margin={[0, '10%', 10, 0]}
                >
                  Your organizational organization.
                </Title>
                <P size={1.2} alpha={0.9} fontWeight={500}>
                  <a onClick={scrollTo('#news')}>Home</a>{' '}
                  &nbsp;&nbsp;&middot;&nbsp;&nbsp;
                  <a onClick={scrollTo('#search')}>Search</a>
                  &nbsp;&nbsp;&middot;&nbsp;&nbsp;
                  <a onClick={scrollTo('#context')}>Explore</a>
                  &nbsp;&nbsp;&middot;&nbsp;&nbsp;
                  <a onClick={scrollTo('#context')}>Answer</a>
                </P>
              </HalfSection>
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
          top: '31%',
          marginLeft: 'calc(-5% - 500px)',
          width: '43%',
          maxWidth: 570,
          height: '22%',
          zIndex: 1,
          pointerEvents: 'none',
          transform: {
            y: searchYOff - 180,
          },
        }}
      >
        <FadedArea fadeDown>
          <img
            src={searchImg}
            css={{
              width: 1150,
              marginTop: 0,
              height: 'auto',
              transformOrigin: 'top left',
              transform: { scale: 0.5, x: 120, y: 140 },
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
  <UI.Theme name="lighter">
    <Callout
      css={
        isLarge && {
          width: '80%',
          position: 'absolute',
          top: searchYOff - 80,
          left: '12%',
        }
      }
    >
      <P size={1.6}>
        Search the entire cloud with keyword summaries of all conversations,
        adjusted to important terms specific to your company.
        <br />
        <br />
        Find documents, links, conversations, projects, and more instantly.
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
                    <FeatureTitle>A heads up for you</FeatureTitle>
                    <FeatureSubTitle>
                      Smart news for your company
                    </FeatureSubTitle>
                    <UI.Theme name="lighter">
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
                          Reduce notification noise and don't miss out on
                          important conversations. Sorted news for your team.
                          <br />
                          <br />
                          Orbit adjusts to what you care about and the custom
                          terminology your team uses.
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
                        <HomeImg
                          css={{
                            position: 'absolute',
                            top: 0,
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
                      marginTop: -195 + searchYOff,
                    }
                  }
                >
                  <FeatureTitle>Smart unified search</FeatureTitle>
                  <FeatureSubTitle>
                    Search with a summary of everything
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
            <SectionContent id="context" fullscreen={isLarge} padded={isLarge}>
              <Glow if={false} style={{ transform: { y: '10%', x: '-55%' } }} />
              <Slant
                css={{ zIndex: 2 }}
                slantSize={14}
                slantBackground={slantBg.darken(0.05)}
              />
              <LeftSide inverse innerStyle={{ paddingTop: '58%' }}>
                <div
                  css={
                    isLarge && {
                      display: 'block',
                      margin: [contextYOff - 130, 0, 0, 30],
                    }
                  }
                >
                  <FeatureTitle>Projects and profiles</FeatureTitle>
                  <FeatureSubTitle>
                    Automatic visiblity into your teams
                  </FeatureSubTitle>
                  <UI.Theme name="lighter">
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
                        Every person is moving fast. Solve N<sup
                          css={{ display: 'inline' }}
                        >
                          2
                        </sup>{' '}
                        communication problems with ease with smart aggregated
                        profiles that show actual relevant information.
                      </P2>
                      <P2 size={1.6}>
                        Orbit also learns your project structure and builds an
                        exploratory interface for whats going on in the company.
                      </P2>
                    </Callout>
                  </UI.Theme>
                  <Observer onChange={this.handleIntersect}>
                    <span />
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
                        width: '45%',
                        height: '58%',
                        marginTop: -340 + contextYOff,
                        top: '56%',
                        left: '47%',
                        marginLeft: 50,
                        overflow: 'hidden',
                      }}
                    >
                      <FadedArea fadeDown fadeRight>
                        <img
                          src={profileImg}
                          css={{
                            position: 'absolute',
                            width: 1199,
                            height: 'auto',
                            transformOrigin: 'top left',
                            transform: {
                              scale: 0.5,
                              x: 50,
                              y: 130,
                            },
                          }}
                        />
                      </FadedArea>
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

@UI.injectTheme
@view
export class SectionSmartSidebar extends React.Component {
  render() {
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <Section
            css={
              isLarge && {
                background: 'transparent',
                marginBottom: -window.innerHeight * 0.23,
              }
            }
            inverse
          >
            <SectionContent
              id="intelligence"
              css={!isLarge && { paddingBottom: 0, overflow: 'visible' }}
              fullscreen={isLarge}
            >
              <Slant
                inverseSlant
                slantSize={14}
                slantBackground={slantBg.darken(0.05)}
                css={{ zIndex: 1 }}
              />
              <LeftSide css={{ top: 0, zIndex: 0 }}>
                <section
                  if={isLarge}
                  css={{
                    position: 'absolute',
                    top: '9%',
                    right: '7%',
                    left: '2%',
                    height: '65%',
                    maxHeight: 800,
                    overflow: 'hidden',
                  }}
                >
                  <FadedArea fadeDown>
                    <img
                      src={intelligenceImg}
                      css={{
                        position: 'absolute',
                        width: 1634,
                        zIndex: 0,
                        height: 'auto',
                        transformOrigin: 'top left',
                        transform: {
                          scale: 0.4,
                          x: -590,
                          y: 200,
                        },
                      }}
                    />
                  </FadedArea>
                </section>
                <div if={isLarge} css={{ height: '100%' }} />
              </LeftSide>

              <RightSide
                inverse
                css={{ zIndex: 1, overflow: 'hidden', top: 0, bottom: 0 }}
              >
                <verticalSpace if={isLarge} css={{ height: '11%' }} />
                <FeatureTitle>Augmented operation</FeatureTitle>
                <FeatureSubTitle>A smart sidebar for every app</FeatureSubTitle>
                <UI.Theme name="lighter">
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
                      From Intercom to docs to email, put your knowledge to
                      work. It's realtime search as you work across all your
                      knowledge.
                      <br />
                      <br />
                      Orbit uses custom on-device OCR that's 100x faster than
                      the current best.
                      <br />
                      <br />
                      Simply hold <Cmd>Option</Cmd> or press{' '}
                      <Cmd>Option+Space</Cmd>.
                    </P>
                  </Callout>
                </UI.Theme>
              </RightSide>
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
            <SectionSmartSidebar />
          </surround>
          <Footer />
        </UI.Theme>
      </features>
    )
  }
}
