import * as React from 'react'
import { view } from '@mcro/black'
import Logo from '~/views/logo'
import * as UI from '@mcro/ui'
import { Section, SectionContent, Slant } from '~/views/section'
import {
  Title,
  SubTitle,
  SubSubTitle,
  SmallTitle,
  P,
  P2,
  LeftSide,
  RightSide,
} from '~/views'
import profileImg from '~/../public/screen-profile.png'
import intelligenceImg from '~/../public/screen-context-word.png'
import newsImg from '~/../public/screen-home.png'
import searchImg from '~/../public/screen-slack-search.png'
import girlImg from '~/../public/video-girl.jpg'
import Observer from '@researchgate/react-intersection-observer'
import { Trail, Spring, animated, config } from 'react-spring'
import HeaderIllustration from './headerIllustration'
import { MailIcon } from '~/views/icons'
import * as Constants from '~/constants'
import Media from 'react-media'
import chatImg from '~/../public/chat.svg'
import SVGInline from 'react-svg-inline'
import Router from '~/router'

export const ChatIcon = props => (
  <SVGInline svg={chatImg} width={`${120}px`} {...props} />
)

const brandColor = Constants.colorMain
const featuresSlantColor = UI.color('#F2B0BF')
const useCasesSlantBg1 = '#F4E1B5'
const useCasesSlantBg2 = '#E0CACA'

export const Border = UI.injectTheme(({ theme, ...props }) => (
  <border
    css={{
      position: 'absolute',
      left: 0,
      right: 0,
      borderBottom: [4, 'dotted', theme.base.color.alpha(0.08)],
      transform: {
        y: -2,
      },
      // width: 'calc(85% + 100px)',
      minWidth: 660,
      maxWidth: Constants.smallSize + 100,
      zIndex: 2,
      margin: [0, 'auto'],
      alignItems: 'center',
      pointerEvents: 'none',
    }}
    {...props}
  />
))

const FadedArea = ({
  fadeRight,
  fadeDown,
  fadeLeft,
  fadeBackground,
  children,
}) => (
  <React.Fragment>
    {children}
    <fadeRight
      if={fadeRight}
      $$fullscreen
      css={{
        left: 'auto',
        width: 100,
        zIndex: 100,
        background: `linear-gradient(to right, transparent, ${fadeBackground ||
          Constants.backgroundColor} 80%)`,
      }}
    />
    <fadeLeft
      if={fadeLeft}
      $$fullscreen
      css={{
        right: 'auto',
        width: 100,
        zIndex: 100,
        background: `linear-gradient(to left, transparent, ${fadeBackground ||
          Constants.backgroundColor} 80%)`,
      }}
    />
    <fadeDown
      if={fadeDown}
      $$fullscreen
      css={{
        top: 'auto',
        height: 100,
        zIndex: 100,
        background: `linear-gradient(transparent, ${fadeBackground ||
          Constants.backgroundColor})`,
      }}
    />
  </React.Fragment>
)

const AppleLogo = props => (
  <svg width="170px" height="170px" viewBox="0 0 170 170" {...props}>
    <path d="m150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58 0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742 3.35-4.929 0.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378 0-10.857 2.346-20.221 7.045-28.068 3.693-6.303 8.606-11.275 14.755-14.925s12.793-5.51 19.948-5.629c3.915 0 9.049 1.211 15.429 3.591 6.362 2.388 10.447 3.599 12.238 3.599 1.339 0 5.877-1.416 13.57-4.239 7.275-2.618 13.415-3.702 18.445-3.275 13.63 1.1 23.87 6.473 30.68 16.153-12.19 7.386-18.22 17.731-18.1 31.002 0.11 10.337 3.86 18.939 11.23 25.769 3.34 3.17 7.07 5.62 11.22 7.36-0.9 2.61-1.85 5.11-2.86 7.51zm-31.26-123.01c0 8.1021-2.96 15.667-8.86 22.669-7.12 8.324-15.732 13.134-25.071 12.375-0.119-0.972-0.188-1.995-0.188-3.07 0-7.778 3.386-16.102 9.399-22.908 3.002-3.446 6.82-6.3113 11.45-8.597 4.62-2.2516 8.99-3.4968 13.1-3.71 0.12 1.0831 0.17 2.1663 0.17 3.2409z" />
  </svg>
)

const DottedButton = props => (
  <btn
    css={{
      display: 'inline-block',
      padding: [8, 12],
      borderRadius: 8,
      border: [1, 'dashed', '#eee'],
      flex: 'none',
      cursor: 'pointer',
      color: brandColor,
      fontWeight: 500,
      fontSize: 16,
      flexFlow: 'row',
      alignItems: 'center',
    }}
    {...props}
  />
)

const Cmd = view('span', {
  padding: [2, 5],
  margin: [-2, 0],
  border: [1, 'dotted', '#ccc'],
  borderRadius: 12,
})

const Lines = ({ width = 100, height = 100, style }) => (
  <svg height={height} width={width} style={style} class="pattern-swatch">
    <rect
      style={{ fill: 'url(#diagonal-stripe-3)' }}
      x="0"
      y="0"
      height={height}
      width={width}
    />
  </svg>
)

@UI.injectTheme
@view
class Callout {
  render({ style, theme, ...props }) {
    return (
      <Media query={Constants.screen.small}>
        {isSmall =>
          isSmall ? (
            <section style={style} {...props} />
          ) : (
            <section $largeCallout style={style}>
              <Lines width={1000} height={2000} $lines />
              <innerSection
                css={{
                  background: theme.base.background.lighten(0.028),
                }}
                {...props}
              />
            </section>
          )
        }
      </Media>
    )
  }

  static style = {
    largeCallout: {
      // border: [1, [0, 0, 0, 0.02]],
      boxShadow: [[0, 3, 10, [0, 0, 0, 0.065]]],
      zIndex: 10,
      overflow: 'hidden',
      position: 'relative',
    },
    lines: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: -2,
      opacity: 0.02,
      transformOrigin: 'top left',
      transform: {
        scale: 12,
      },
    },
    innerSection: {
      margin: 4,
      padding: 26,
      overflow: 'hidden',
      position: 'relative',
      [Constants.screen.smallQuery]: {
        margin: 0,
      },
    },
  }
}

@view
export class BrandLogo {
  render() {
    return (
      <brandMark {...this.props}>
        <Logo size={0.25} color={brandColor} iconColor={brandColor} />
        <P
          if={false}
          size={1}
          fontWeight={700}
          alpha={0.8}
          css={{ marginTop: 10 }}
        >
          Your cloud, home
        </P>
      </brandMark>
    )
  }

  static style = {
    brandMark: {
      alignItems: 'center',
      textAlign: 'center',
    },
  }
}

@view
export class Header {
  render() {
    return (
      <header>
        <headerBorder
          css={{
            position: 'absolute',
            bottom: 0,
            height: 1,
            background: '#f4f4f4',
            left: 0,
            right: 0,
          }}
        />
        <SectionContent>
          <headerInner>
            <BrandLogo css={{ cursor: 'pointer' }} onClick={Router.link('/')} />
            <div $$flex />
            <nav>
              <a href="/features" onClick={Router.link('/features')}>
                Features
              </a>
              <a href="/use-cases" onClick={Router.link('/use-cases')}>
                Use Cases
              </a>
              <a href="/about" onClick={Router.link('/about')}>
                About
              </a>
            </nav>
          </headerInner>
        </SectionContent>
      </header>
    )
  }

  static style = {
    header: {
      top: 0,
      left: 0,
      right: 0,
      position: 'absolute',
      zIndex: 1,
    },
    headerInner: {
      padding: [25, 0],
      flexFlow: 'row',
      zIndex: 100,
      alignItems: 'center',
      [Constants.screen.smallQuery]: {
        padding: [0, 0, 20, 0],
      },
    },
    nav: {
      flexFlow: 'row',
      width: 240,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  }
}

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
                      size={isLarge ? 6.5 : 4}
                      margin={[-15, 0, 20, -5]}
                    >
                      Command<br />your cloud
                    </Title>
                    <line
                      if={false}
                      css={{
                        margin: [26, 40],
                        width: '75%',
                        height: 4,
                        background: '#ddd',
                        opacity: 0.15,
                      }}
                    />
                    <P
                      size={isLarge ? 1.9 : 1.5}
                      alpha={0.75}
                      margin={[0, '27%', 15, 0]}
                      css={{
                        lineHeight: '36px',
                      }}
                    >
                      Upgrade your Mac's intelligence with a unified work
                      operating system.
                    </P>
                    <P2 if={false} size={1}>
                      AI for your organization.
                    </P2>

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
                        tooltip="Completely private on-device."
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
                      <HeaderIllustration />
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

const Notification = ({ title, body, ...props }) => (
  <notification
    css={{
      width: 300,
      height: 70,
      background: '#f3f3f3',
      border: [1, '#ddd'],
      padding: 10,
      borderRadius: 7,
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      flexFlow: 'row',
      overflow: 'hidden',
      marginBottom: 20,
      textAlign: 'left',
    }}
    {...props}
  >
    <MailIcon size={0.09} css={{ margin: [0, 10, 0, 0] }} />
    <content
      css={{
        padding: 3,
        flex: 1,
        overflow: 'hidden',
      }}
    >
      <notTitle css={{ fontWeight: 600 }}>{title}</notTitle>
      <UI.Text ellipse={1}>{body}</UI.Text>
    </content>
  </notification>
)

const sleep = ms => new Promise(res => setTimeout(res, ms))

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

const Glow = ({ below, style = {}, ...props }) => (
  <glow
    $$fullscreen
    css={{
      zIndex: below ? -1 : 0,
      background: '#fff',
      ...style,
      filter: {
        blur: 160,
        ...style.filter,
      },
      transform: {
        scale: 0.38,
        y: '-20%',
        ...style.transform,
      },
    }}
    {...props}
  />
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
      <UI.Theme name="light">
        <Media query={Constants.screen.large}>
          {isLarge => (
            <Section id="features" inverse>
              <SectionContent
                padded={!isLarge}
                css={!isLarge && { paddingBottom: 0 }}
                fullscreen={isLarge}
              >
                <Glow />
                <Glow style={{ transform: { y: '130%' } }} />
                <Slant
                  inverseSlant
                  slantBackground={`linear-gradient(200deg, #f2f2f2 5%, ${featuresSlantColor} 95%)`}
                />
                <Slant
                  css={{ zIndex: 1 }}
                  slantSize={12}
                  amount={20}
                  slantBackground={`linear-gradient(200deg, ${Constants.colorSecondary.alpha(
                    0.4,
                  )} 5%, ${featuresSlantColor.desaturate(0.5).alpha(0.1)} 95%)`}
                />
                <LeftSide css={{ top: 0 }}>
                  <Observer onChange={this.handleIntersect}>
                    <content
                      css={{
                        display: 'block',
                        marginTop: isLarge ? newsTopOffPct : 0,
                      }}
                    >
                      <SmallTitle css={{ margin: [-50, 0, 8] }}>
                        How Orbit Works
                      </SmallTitle>
                      <SubTitle size={4.6}>News</SubTitle>
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
                      marginTop: '-45%',
                      right: '6%',
                      left: '5%',
                      height: '80%',
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
                    <SubTitle size={4.3}>Search</SubTitle>
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
      <UI.Theme name="light">
        <Media query={Constants.screen.large}>
          {isLarge => (
            <Section>
              <SectionContent fullscreen={isLarge} padded>
                <Glow style={{ transform: { y: '30%' } }} />
                <Slant
                  css={{ zIndex: 2 }}
                  slantBackground={`linear-gradient(200deg, ${featuresSlantColor} 5%, ${altBg.darken(
                    0.05,
                  )} 95%)`}
                />
                <Slant
                  inverseSlant
                  css={{ zIndex: 1 }}
                  slantSize={12}
                  amount={20}
                  slantBackground={`linear-gradient(200deg, ${featuresSlantColor
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
                    <SubTitle size={4.2}>Intelligence</SubTitle>
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
                        <FadedArea fadeLeft fadeBackground="#fff">
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

const altBg = UI.color('#FCF6ED')
const peachTheme = {
  background: altBg,
  color: altBg.darken(0.8).desaturate(0.1),
  titleColor: altBg.darken(0.55).desaturate(0.3),
  subTitleColor: altBg.darken(0.55).desaturate(0.8),
}

@view
export class SectionUseCaseRemoteTeams {
  render() {
    return (
      <UI.Theme theme={peachTheme}>
        <Media query={Constants.screen.large}>
          {isLarge => (
            <Section id="use-cases" inverse css={{ background: altBg }}>
              <SectionContent
                id="remote-teams"
                fullscreen={isLarge}
                padded
                css={{ zIndex: 3 }}
              >
                <Glow
                  style={{
                    background: altBg.lighten(0.015),
                    transform: { x: '-30%', y: '-15%' },
                  }}
                />
                <Slant
                  inverseSlant
                  slantBackground={`linear-gradient(200deg, ${altBg.darken(
                    0.05,
                  )} 5%, ${useCasesSlantBg1} 95%)`}
                  css={{ zIndex: 2 }}
                />
                <LeftSide>
                  <SmallTitle margin={[0, 0, 8]}>Use Cases</SmallTitle>
                  <SubTitle italic>
                    Remote<br />
                    teams
                  </SubTitle>
                  <div if={isLarge} css={{ height: '26%' }} />
                  <section
                    css={{
                      textAlign: 'left',
                      display: 'block',
                      margin: isLarge ? [-40, 0, 0, '25%'] : 0,
                    }}
                  >
                    <SubSubTitle>Connecting people</SubSubTitle>
                    <P alpha={0.6} size={2} margin={[0, 0, 10]}>
                      Beautiful unified profiles
                    </P>
                    <P2 size={1.6}>
                      Combined information from across the cloud in one place
                      with helpful information.
                    </P2>
                    <P2 size={1.6}>
                      See where people talk in Slack, what topics they care
                      about, and relevant recently edited files, tickets, and
                      more.
                    </P2>
                    <br />
                  </section>
                  <Callout
                    css={
                      isLarge && {
                        width: '72%',
                        marginLeft: '35%',
                        textAlign: 'left',
                      }
                    }
                  >
                    <P2 size={2} margin={0}>
                      Give your remote team a sense of unity and a place to
                      explore your company.
                    </P2>
                  </Callout>
                </LeftSide>
                <RightSide inverse css={{ bottom: 0 }}>
                  <div $$flex css={{ marginTop: isLarge ? '22%' : 0 }} />
                  <SubSubTitle>A company home</SubSubTitle>
                  <P2 if={false} size={1.8} css={{ margin: [5, 0, 10, 0] }}>
                    The smart way to sync
                  </P2>
                  <P
                    alpha={0.6}
                    size={2}
                    css={{ margin: [0, isLarge ? '20%' : 0, 10, 0] }}
                  >
                    News is your team home
                  </P>
                  <P size={1.6} css={{ marginRight: isLarge ? '20%' : 0 }}>
                    It starts by learning company vocabulary. Then it learns
                    what you care about. The intersection of what you care about
                    and haven't seen, relative to your custom company's unique
                    vocab is shown.
                  </P>
                  <section
                    if={isLarge}
                    css={{
                      position: 'absolute',
                      top: '35%',
                      left: 50,
                      height: '35%',
                      width: 450,
                      overflow: 'hidden',
                    }}
                  >
                    <FadedArea fadeBackground={altBg} fadeDown fadeRight>
                      <img
                        src={profileImg}
                        css={{
                          position: 'absolute',
                          width: 1199,
                          height: 'auto',
                          transformOrigin: 'top left',
                          transform: {
                            scale: 0.39,
                            x: 0,
                            y: 0,
                          },
                        }}
                      />
                    </FadedArea>
                  </section>
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
export class SectionUseCaseRemoteFirst {
  render() {
    return (
      <UI.Theme theme={peachTheme}>
        <Media query={Constants.screen.large}>
          {isLarge => (
            <Section id="customer-success" css={{ background: altBg }}>
              <SectionContent fullscreen={isLarge} padded>
                <Border css={{ top: -80 }} />
                <Glow
                  style={{
                    background: altBg.lighten(0.015),
                    transform: { x: '-20%', y: '-25%' },
                  }}
                />
                <Slant
                  slantBackground={`linear-gradient(200deg, ${useCasesSlantBg1} 5%, ${useCasesSlantBg2} 95%)`}
                />
                <chat
                  css={{
                    opacity: 0.1,
                    filter: {
                      grayscale: '100%',
                    },
                    transform: { scale: 3 },
                    position: 'absolute',
                    zIndex: 0,
                    left: '27%',
                    top: '20%',
                  }}
                >
                  <ChatIcon />
                </chat>
                <LeftSide inverse>
                  <div if={isLarge} css={{ height: '48%' }} />

                  <section
                    css={{
                      textAlign: 'left',
                      display: 'block',
                      margin: isLarge ? [0, 0, 0, '25%'] : 0,
                    }}
                  >
                    <SubSubTitle>Better support responses</SubSubTitle>
                    <P
                      if={isLarge}
                      alpha={0.6}
                      size={2}
                      css={{ margin: [0, '25%', 10, 0] }}
                    >
                      Live help for live support
                    </P>
                    <P2
                      size={1.6}
                      css={{ margin: isLarge ? [0, 0, 35, 0] : 0 }}
                    >
                      Orbit's contextual answers work with your support software
                      as your team chats. In realtime it searches across your
                      cloud and shows exact sections with answers.
                    </P2>
                  </section>
                  <Callout
                    if={isLarge}
                    css={{
                      width: '80%',
                      marginLeft: '25%',
                      textAlign: 'left',
                    }}
                  >
                    <P2 size={2} margin={0}>
                      Answers on hand for your entire success team, powered by
                      all your knowledgebase.
                    </P2>
                  </Callout>
                </LeftSide>
                <RightSide css={{ top: 0 }}>
                  <SmallTitle margin={[-10, 0, 8]}>Use Cases</SmallTitle>
                  <SubTitle italic>
                    Customer<br />Success
                  </SubTitle>
                  <div if={isLarge} $$flex css={{ marginTop: '15%' }} />
                  <SubSubTitle>Less onboarding for sales</SubSubTitle>
                  <P
                    if={isLarge}
                    alpha={0.6}
                    size={2}
                    css={{ margin: [0, '15%', 10, 0] }}
                  >
                    Knowledge at hand
                  </P>
                  <P2 size={1.6} css={isLarge && { marginRight: '20%' }}>
                    Sales chat requires intimate knowledge of your product.
                    Orbit sits side by side with your success team as they chat
                    on Intercom or ZenDesk providing realtime answers from your
                    knowledgebase.
                  </P2>
                  <Callout
                    if={isLarge}
                    css={{ margin: [35, '15%', 40, 0], left: -30 }}
                  >
                    <P2 size={2} margin={0}>
                      Organizational knowledge is now always at hand and usable
                      during outbound chats.
                    </P2>
                  </Callout>
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
export class SectionUseCaseReduceInterrupts {
  render() {
    return (
      <UI.Theme theme={peachTheme}>
        <Media query={Constants.screen.large}>
          {isLarge => (
            <Section id="use-cases" inverse css={{ background: altBg }}>
              <SectionContent
                id="remote-teams"
                fullscreen={isLarge}
                padded
                css={{ zIndex: 3 }}
              >
                <Glow
                  style={{
                    background: altBg.lighten(0.025),
                    transform: { x: '-20%', y: '-25%' },
                  }}
                />
                <Border css={{ top: -20 }} />
                <Slant
                  inverseSlant
                  slantBackground={`linear-gradient(200deg, ${useCasesSlantBg2} 5%, ${altBg} 95%)`}
                  css={{ zIndex: 2 }}
                />
                <LeftSide>
                  <SmallTitle margin={[-20, 0, 8]}>Use Cases</SmallTitle>
                  <SubTitle italic>
                    Workplace<br />
                    interruptions
                  </SubTitle>
                  <Notification
                    if={isLarge}
                    title="Uber Receipts"
                    body="Your Thursday morning trip with Uber"
                    css={{
                      marginLeft: 'auto',
                      marginTop: 60,
                      marginBottom: -40,
                    }}
                  />
                  <div if={isLarge} css={{ height: '28%' }} />
                  <section
                    css={{
                      textAlign: 'left',
                      display: 'block',
                      margin: isLarge ? [-40, 0, 0, '30%'] : 0,
                    }}
                  >
                    <SubSubTitle>Prevent shoulder taps</SubSubTitle>
                    <P
                      if={isLarge}
                      alpha={0.6}
                      size={2}
                      css={{ margin: [0, '25%', 10, 0] }}
                    >
                      Stop losing links and files
                    </P>
                    <P2 size={1.6}>
                      Search that actually works means a lot less time hunting
                      around for files. Combined with smart profiles that show
                      you recent collaborations, Orbit aims to eliminate pings
                      for things you just can't find in the cloud.
                    </P2>
                  </section>
                  <Callout
                    if={isLarge}
                    css={
                      isLarge && {
                        width: '72%',
                        marginLeft: '35%',
                        marginTop: 35,
                        textAlign: 'left',
                      }
                    }
                  >
                    <P2 size={2} margin={0}>
                      The Orbit search model uses state of the art NLP that
                      learns your company corpus.
                    </P2>
                  </Callout>
                </LeftSide>
                <RightSide inverse css={{ bottom: 0 }}>
                  <div $$flex css={{ marginTop: isLarge ? '30%' : 0 }} />
                  <SubSubTitle>Notification noise</SubSubTitle>
                  <P
                    if={isLarge}
                    alpha={0.6}
                    size={2}
                    css={{ margin: [0, '25%', 10, 0] }}
                  >
                    Enabling deep work
                  </P>
                  <P2 size={1.6} css={{ marginRight: isLarge ? '22%' : 0 }}>
                    Use the power of Do Not Disturb in Slack without losing
                    synchronicity. Home lets you snooze notifications but still
                    pull, exactly when you're ready, to see everything new.
                  </P2>
                  <Callout css={{ margin: [35, '20%', 0, 0], left: -45 }}>
                    <P2 size={2} margin={0}>
                      Pull, instead of being pushed by notifications.
                    </P2>
                  </Callout>
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
export class Footer {
  render() {
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <Section>
            <SectionContent padded css={isLarge && { padding: [150, 0] }}>
              <left
                css={
                  isLarge
                    ? { width: '50%', padding: [0, 20] }
                    : { padding: [0, 0, 50] }
                }
              >
                <Callout>
                  <SmallTitle>Our Mission</SmallTitle>
                  <P2 size={1.6}>
                    Orbit runs intimately in your everyday. That means it has to
                    work for you, the individual.
                    <br />
                    <br />
                    Our goal is to build a more intuitive OS. To do that we need
                    trust. Privacy, security, and user experience our first
                    priorities.
                  </P2>
                </Callout>
              </left>
              <RightSide noEdge>
                <div css={{ flexFlow: 'row' }}>
                  <div $$flex />
                  <BrandLogo />
                </div>
              </RightSide>
            </SectionContent>
          </Section>
        )}
      </Media>
    )
  }
}

export const SearchIllustration = () => (
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

@view
export default class HomePage {
  render() {
    return (
      <React.Fragment>
        <Header />
        <Home />
      </React.Fragment>
    )
  }
}
