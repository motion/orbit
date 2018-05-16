import * as React from 'react'
import { view } from '@mcro/black'
import Logo from '~/views/logo'
import * as UI from '@mcro/ui'
import { Section, SectionContent, Slant } from '~/views'
// import homeImg from '~/../public/screen-home.png'
import profileImage from '~/../public/screen-profile.png'
import wordImg from '~/../public/screen-context-word.png'
import homeImg from '~/../public/screen-home.png'
import slackSearchImg from '~/../public/screen-slack-search.png'
import girlImg from '~/../public/video-girl.jpg'
import Observer from '@researchgate/react-intersection-observer'
import { Trail, Spring, animated, config } from 'react-spring'
import HeaderIllustration from './headerIllustration'
import { MailIcon } from '~/views/icons'
import * as Constants from '~/constants'
import Media from 'react-media'

const brandColor = Constants.colorMain

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

const IS_UPPER = /[A-Z]/
const changeCaps = (str, reducePct) =>
  typeof str === 'string'
    ? str
        .split('')
        .map(
          char =>
            IS_UPPER.test(char) ? (
              <span style={{ fontSize: `${100 - reducePct}%` }}>{char}</span>
            ) : (
              char
            ),
        )
    : str

const Title = ({ children, reduceCapsPct, italic, size = 4, ...props }) => (
  <P
    size={size}
    fontWeight={700}
    margin={[0, 0, 5]}
    css={{
      fontFamily: '"Mercury Display A", "Mercury Display B"',
      fontStyle: italic ? 'italic' : 'normal',
      letterSpacing: size < 4 ? -1 : 0,
    }}
    {...props}
  >
    {reduceCapsPct ? changeCaps(children, reduceCapsPct) : children}
  </P>
)

const SubTitle = UI.injectTheme(({ theme, ...props }) => (
  <Title
    size={3.6}
    color={theme.subTitleColor || theme.base.color}
    reduceCapsPct={5}
    {...props}
  />
))

const SmallTitle = props => (
  <P
    size={1}
    fontWeight={700}
    textTransform="uppercase"
    alpha={0.5}
    padding={[0, 2]}
    margin={[0, 0, 5]}
    {...props}
  />
)

const sidePadSmall = 40

const RightSide = ({ children, inverse, noEdge, ...props }) => (
  <Media query={Constants.screen.small}>
    {isSmall =>
      isSmall ? (
        <rightSide css={{ padding: [0, 0, sidePadSmall, 0] }}>
          {children}
        </rightSide>
      ) : (
        <rightSide
          css={{
            zIndex: 3,
            flex: 1,
            position: 'absolute',
            left: '50%',
            right: 0,
            bottom: 80,
            top: 80,
            paddingRight: 20,
            justifyContent: 'center',
          }}
          {...props}
        >
          <inner
            if={!noEdge}
            css={{
              display: 'block',
              height: '100%',
            }}
          >
            <edge
              css={{
                shapeOutside: inverse
                  ? 'polygon(0% 0%, 0% 21px, 174% 2131px)'
                  : 'polygon(0% 0%, 90px 0%, 0% 1096px)',
                float: 'left',
                width: 187,
                height: '100%',
                marginLeft: -90,
              }}
            />
            {children}
          </inner>
          {noEdge && children}
        </rightSide>
      )
    }
  </Media>
)

const LeftSide = ({ children, innerStyle, noEdge, inverse, ...props }) => (
  <Media query={Constants.screen.small}>
    {isSmall =>
      isSmall ? (
        <leftSide css={{ padding: [0, 0, sidePadSmall, 0] }}>
          {children}
        </leftSide>
      ) : (
        <leftSide
          css={{
            zIndex: 3,
            flex: 1,
            position: 'absolute',
            left: 0,
            right: '50%',
            bottom: 80,
            top: 80,
            paddingRight: 20,
            justifyContent: 'center',
            textAlign: 'right',
          }}
          {...props}
        >
          <inner
            style={innerStyle}
            css={{
              display: 'block',
              height: '100%',
            }}
          >
            <edge
              if={!noEdge}
              css={{
                shapeOutside: inverse
                  ? 'polygon(105% 0%, 90px 0%, 0% 1096px)'
                  : 'polygon(0% 0%, 1px 0%, 96% 1096px)',
                float: 'right',
                width: 110,
                height: 990,
                marginLeft: inverse ? -15 : -35,
              }}
            />
            {children}
          </inner>
        </leftSide>
      )
    }
  </Media>
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
      opacity: 0.01,
      transformOrigin: 'top left',
      transform: {
        scale: 4,
      },
    },
    innerSection: {
      margin: 10,
      padding: 26,
      overflow: 'hidden',
      position: 'relative',
      [Constants.screen.smallQuery]: {
        margin: 0,
      },
    },
  }
}

const P = props => <UI.Text selectable css={{ display: 'block' }} {...props} />
const P2 = props => <P size={2} alpha={0.9} margin={[0, 0, 20]} {...props} />
const Ul = view('span', {
  display: 'inline-block',
  borderBottom: [3, 'rgba(136, 231, 234, 0.9)'],
  marginBottom: -3,
})

@view
class BrandLogo {
  render() {
    return (
      <brandMark>
        <Logo size={0.3} color={brandColor} iconColor={brandColor} />
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
      // background: '#fff',
      // padding: 20,
      // margin: -20,
      // marginLeft: -60,
      alignItems: 'center',
      textAlign: 'center',
    },
  }
}

@view
class Header {
  render() {
    return (
      <Section>
        <SectionContent padded fullscreen>
          <Slant
            slantBackground={`linear-gradient(200deg, #f5b926, ${
              Constants.colorSecondary
            } 85%)`}
          />
          <Media
            query={Constants.screen.large}
            render={() => (
              <glowContain
                css={{
                  position: 'absolute',
                  top: -200,
                  left: -100,
                  bottom: 0,
                  right: '49.5%',
                  zIndex: 1,
                  overflow: 'hidden',
                  transform: {
                    rotate: '4.7deg',
                  },
                }}
              >
                <glow
                  css={{
                    position: 'absolute',
                    top: '42%',
                    right: 0,
                    marginRight: -172,
                    background: '#fff',
                    opacity: 1,
                    width: 350,
                    height: 300,
                    borderRadius: 100,
                    filter: {
                      blur: 120,
                    },
                  }}
                />
              </glowContain>
            )}
          />
          <top $$row>
            <BrandLogo />
            <div $$flex />
          </top>
          <div $$flex />
          <Media query={Constants.screen.large}>
            {isLarge => (
              <mainSection $smallCallout={!isLarge} $largeCallout={isLarge}>
                <Title
                  italic
                  reduceCapsPct={10}
                  size={isLarge ? 6.5 : 4.5}
                  margin={[0, 0, 0, -5]}
                >
                  Smarter company organization
                </Title>
                <line
                  css={{
                    margin: [26, 40],
                    height: 4,
                    background: '#ddd',
                    opacity: 0.15,
                  }}
                />
                <P size={isLarge ? 2 : 1.5} alpha={0.75} margin={[0, 0, 15, 0]}>
                  Upgrade Spotlight and Notification Drawer<br />
                  with AI for your company cloud.
                </P>

                <actions
                  $$row
                  css={{
                    margin: isLarge ? [25, 'auto', 0, 0] : 0,
                    alignItems: 'center',
                    justifyContent: 'center',
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
                    Privacy
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
    )
  }

  static style = {
    mainSection: {
      position: 'relative',
      zIndex: 10,
    },
    header: {
      padding: 25,
      position: 'relative',
    },
    smallCallout: {
      padding: [10, 0, 40, 0],
    },
    largeCallout: {
      width: '48%',
      margin: [-50, 0, 0, 0],
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
    top: {
      flexFlow: 'row',
      zIndex: 100,
      position: 'relative',
      [Constants.screen.smallQuery]: {
        padding: [0, 0, 20, 0],
      },
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
      bottom: 160,
      overflow: 'hidden',
      left: '50%',
      paddingLeft: '5%',
      zIndex: 4,
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

const Notification = ({ title, body }) => (
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
    }}
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

const newsTopOffPct = '12%'
const searchYOff = -40
const contextYOff = 160

const FeatureSubTitle = props => (
  <P2
    size={1.8}
    alpha={0.6}
    css={{
      marginBottom: 30,
    }}
    {...props}
  />
)

const SearchCallout = ({ isLarge }) => (
  <Callout
    css={
      isLarge && {
        width: 500,
        position: 'absolute',
        top: searchYOff - 55,
        left: 40,
      }
    }
  >
    <P2 size={1.6} css={{ textAlign: 'left', margin: 0 }}>
      Search across the entire cloud with fast conceptual search that aggregates
      your cloud services and summarizes Slack conversations.
      <vertSpace css={{ height: 20 }} />
      Search people to see profiles that show where they spend time, recent
      interactions and more.
    </P2>
  </Callout>
)

@view
class Section2 extends React.Component {
  state = {
    showOrbit: false,
    showNotifs: true,
    items: [
      {
        title: 'Emily Parker',
        body: 'Book club is cancelled tomorrow',
      },
      {
        title: 'Emily Parker',
        body: 'Book club is cancelled tomorrow',
      },
      {
        title: 'Emily Parker',
        body: 'Book club is cancelled tomorrow',
      },
      {
        title: 'Emily Parker',
        body: 'Book club is cancelled tomorrow',
      },
      {
        title: 'Emily Parker',
        body: 'Book club is cancelled tomorrow',
      },
      {
        title: 'Emily Parker',
        body: 'Book club is cancelled tomorrow',
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
    await sleep(1500)
    this.setState({ showNotifs: false })
    await sleep(2000)
    this.setState({ showOrbit: true })
  }

  render() {
    const { showOrbit, showNotifs } = this.state

    return (
      <UI.Theme name="light">
        <Media query={Constants.screen.large}>
          {isLarge => (
            <Section id="features" inverse>
              <SectionContent padded fullscreen>
                <Slant
                  inverseSlant
                  slantBackground={`linear-gradient(200deg, ${
                    Constants.colorSecondary
                  } 5%, #f2f2f2 95%)`}
                />
                <LeftSide>
                  <Observer onChange={this.handleIntersect}>
                    <content
                      css={{ display: 'block', marginTop: newsTopOffPct }}
                    >
                      <SmallTitle css={{ margin: [0, 0, 10] }}>
                        How Orbit Works
                      </SmallTitle>
                      <SubTitle size={4.8}>News</SubTitle>
                      <FeatureSubTitle
                        css={{
                          marginTop: 12,
                        }}
                      >
                        Stay smart with <Cmd>⌘+Space</Cmd>
                      </FeatureSubTitle>
                      <Callout
                        css={
                          isLarge
                            ? { width: 510, position: 'absolute', right: -10 }
                            : {}
                        }
                      >
                        <P2 size={1.6} css={{ textAlign: 'left' }} margin={0}>
                          Your team uses the right tool for the job. But that
                          can lead to a pretty messy big picture.
                          <vertSpace css={{ height: 20 }} />
                          Stay focused without missing out. It's well summarized
                          news that's relevant to you and your team from across
                          all your integrations.
                          <vertSpace css={{ height: 20 }} />
                          Eliminate notification overload.
                        </P2>
                        <DottedButton
                          css={{ position: 'absolute', bottom: 20, right: 20 }}
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
                      marginTop: -20,
                      right: 20,
                      left: 0,
                      height: 700,
                      overflow: 'hidden',
                    }}
                  >
                    <notifications
                      css={{
                        position: 'absolute',
                        top: 50,
                        left: 50,
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
                            src={homeImg}
                            css={{
                              position: 'absolute',
                              top: 35,
                              right: -700,
                              width: 1100,
                              height: 'auto',
                              transformOrigin: 'top left',
                              transform: {
                                scale: 0.45,
                              },
                              boxShadow: [[0, 15, 120, [0, 0, 0, 0.1]]],
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
                        width: 150,
                        zIndex: 100,
                        background: `linear-gradient(to right, transparent, ${
                          Constants.backgroundColor
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

                  <div if={isLarge} css={{ height: 'calc(100% - 240px)' }} />
                  <content
                    css={{
                      display: 'block',
                      background: Constants.backgroundColor,
                      position: 'relative',
                      zIndex: 1000,
                    }}
                  >
                    <SubTitle size={4.8}>Search</SubTitle>
                    <FeatureSubTitle>Spotlight, meet the cloud</FeatureSubTitle>
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
class Section3 extends React.Component {
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
              <SectionContent fullscreen padded>
                <Slant
                  css={{ zIndex: 2 }}
                  slantBackground={`linear-gradient(200deg, #f2f2f2 80%, ${altBg.darken(
                    0.05,
                  )} 95%)`}
                />
                <LeftSide inverse innerStyle={{ paddingTop: '50%' }}>
                  <div
                    css={
                      isLarge && {
                        display: 'block',
                        margin: [contextYOff - 20, 0, 0, 30],
                      }
                    }
                  >
                    <SubTitle size={4.8}>Intelligence</SubTitle>
                    <FeatureSubTitle>
                      Always on contextual answers
                    </FeatureSubTitle>
                    <Callout
                      css={
                        isLarge && {
                          width: 510,
                          position: 'absolute',
                          right: 5,
                        }
                      }
                    >
                      <P2 size={1.6} css={{ textAlign: 'left', margin: 0 }}>
                        Attach realtime search to any app with a simple hold of{' '}
                        <Cmd>Option</Cmd>. Important terms, people, and items in
                        your cloud are shown instantly.
                        <vertSpace css={{ height: 20 }} />
                        It's a new way to stay in sync.
                      </P2>
                      <DottedButton
                        css={{ position: 'absolute', bottom: 20, right: 20 }}
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
                          height: 500,
                          marginTop: -250 + contextYOff,
                          top: '50%',
                          left: '50%',
                          marginLeft: 50,
                          overflow: 'hidden',
                        }}
                      >
                        <Spring from={{ x: 100 }} to={{ x: 10 }}>
                          {({ x }) => (
                            <animated.div
                              style={{
                                transform: `translate3d(${x}px,0,0)`,
                              }}
                            >
                              <img
                                src={wordImg}
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

                        <fadeDown
                          if={false}
                          css={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 100,
                            zIndex: 100,
                            background: `linear-gradient(transparent, ${
                              Constants.backgroundColor
                            } 95%)`,
                          }}
                        />
                        <fadeLeft
                          css={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            top: 0,
                            width: 100,
                            zIndex: 100,
                            background: `linear-gradient(to left, transparent, ${
                              Constants.backgroundColor
                            } 95%)`,
                          }}
                        />
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
  color: altBg.darken(0.8).desaturate(0.2),
  titleColor: altBg.darken(0.55).desaturate(0.2),
  subTitleColor: altBg.darken(0.6).desaturate(0.2),
}

@view
class Section4 {
  render() {
    return (
      <UI.Theme theme={peachTheme}>
        <Media query={Constants.screen.large}>
          {isLarge => (
            <Section id="use-cases" inverse css={{ background: altBg }}>
              <SectionContent
                id="remote-teams"
                fullscreen
                padded
                css={{ zIndex: 3 }}
              >
                <Slant
                  inverseSlant
                  slantBackground={`linear-gradient(200deg, ${altBg.darken(
                    0.05,
                  )} 5%, ${altBg.darken(0.1)} 95%)`}
                  css={{ zIndex: 2 }}
                />
                <LeftSide>
                  <SmallTitle margin={[0, 0, 10]}>Use Cases</SmallTitle>
                  <SubTitle italic>
                    Enabling<br />
                    remote-first<br />
                    companies
                  </SubTitle>
                  <P2 size={1.8} css={{ paddingLeft: isLarge ? 50 : 0 }}>
                    Inspired by Stripe<br />
                    Orbit is a beautiful<br />
                    company home.
                  </P2>
                  <div if={isLarge} css={{ height: 210 }} />
                  <section
                    css={{
                      textAlign: 'left',
                      display: 'block',
                      margin: isLarge ? [0, 0, 0, 90] : 0,
                    }}
                  >
                    <P size={1.2} fontWeight={800}>
                      Connect people
                    </P>
                    <P2 size={1.5}>
                      A single profile is created for everyone from combined
                      info across your cloud. See which Slack rooms people spend
                      time in. What general topics they are interested in. Plus
                      see recently edited and relevant files, tickets, and more
                      that are relevant to both you and them.
                    </P2>
                  </section>
                  <Callout
                    css={
                      isLarge && {
                        width: 460,
                        marginLeft: 120,
                        textAlign: 'left',
                      }
                    }
                  >
                    <P2 size={2} margin={0}>
                      Allow everyone to turn do not disturb on more easily, and
                      focus for longer periods of time.
                    </P2>
                  </Callout>
                </LeftSide>
                <RightSide inverse css={{ bottom: 0 }}>
                  <div $$flex css={{ marginTop: isLarge ? 200 : 0 }} />
                  <P size={1.2} fontWeight={800}>
                    Homebase
                  </P>
                  <P2 size={1.5} css={{ marginRight: isLarge ? 90 : 0 }}>
                    News in Orbit is designed for distributing knowledge with
                    intelligence. It starts by learning your company vocabulary.
                    Then it learns locally what you care about. The intersection
                    of what you care about and haven't seen, relative to your
                    custom company corpus is then shown.
                  </P2>
                  <Callout css={{ margin: [20, 0, 40, 0], left: -55 }}>
                    <div $$row>
                      <P2 size={2} margin={0}>
                        A carefully curated newspaper, daily, for everyone in
                        the company.
                      </P2>
                    </div>
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
class Section6 {
  render() {
    return (
      <UI.Theme theme={peachTheme}>
        <Media query={Constants.screen.large}>
          {isLarge => (
            <Section id="customer-success" css={{ background: altBg }}>
              <SectionContent fullscreen padded>
                <Slant slantBackground={altBg.darken(0.1)} />
                <LeftSide inverse>
                  <SubTitle italic>
                    Improving<br />Customer<br />Success
                  </SubTitle>
                  <div if={isLarge} css={{ height: 240 }} />
                  <P size={1.2} fontWeight={800}>
                    Faster Responses for Support
                  </P>
                  <P2 size={1.5} css={{ margin: isLarge ? [0, 0, 25, 90] : 0 }}>
                    Orbit's contextual answers work with your support software
                    as your team chats. In realtime it searches knowledge and
                    highlights the exact section with a potential answer.
                  </P2>
                  <Callout
                    css={
                      isLarge && {
                        width: 460,
                        marginLeft: 80,
                        marginBottom: -30,
                      }
                    }
                  >
                    <P2 size={2} margin={0}>
                      Answers on hand for your entire success team, powered by
                      all your knowledgebase.
                    </P2>
                  </Callout>
                </LeftSide>
                <RightSide>
                  <div if={isLarge} $$flex css={{ marginTop: 200 }} />
                  <P size={1.2} fontWeight={800}>
                    Reduced Onboarding for Sales
                  </P>
                  <P2 size={1.5} css={{ marginRight: 90 }}>
                    Sales requires intimate knowledge of your product. Orbit can
                    sit side by side with your success team as they chat on
                    Intercom or ZenDesk providing realtime answers from your
                    knowledgebase.
                  </P2>
                  <Callout css={{ margin: [20, 0, 40, 0], left: -55 }}>
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
class Section7 {
  render() {
    return (
      <UI.Theme theme={peachTheme}>
        <Media query={Constants.screen.large}>
          {isLarge => (
            <Section id="reduce-interrupts" inverse css={{ background: altBg }}>
              <SectionContent fullscreen padded css={{ zIndex: 3 }}>
                <Slant
                  inverseSlant
                  slantBackground={`linear-gradient(200deg, ${altBg.darken(
                    0.1,
                  )} 5%, ${altBg} 95%)`}
                  css={{ zIndex: 2 }}
                />
                <LeftSide>
                  <SmallTitle margin={[0, 0, 10]}>Use Cases</SmallTitle>
                  <SubTitle italic>
                    Reducing<br />
                    workplace<br />
                    interruptions
                  </SubTitle>
                  <P2 size={1.8} css={isLarge && { paddingLeft: 50 }}>
                    Orbit focuses on the individual<br /> to make teams less
                    interrupted.
                  </P2>
                  <div if={isLarge} css={{ height: 220 }} />
                  <P size={1.2} fontWeight={800}>
                    Turning Down Notifications
                  </P>
                  <P2 size={1.5} css={isLarge && { margin: [0, 0, 25, 90] }}>
                    The Orbit home page is designed around picking the right
                    things to show you based on how you work. It's summarization
                    also lets you glance to see what's new.
                  </P2>
                  <Callout
                    css={
                      isLarge && {
                        width: 460,
                        marginLeft: 120,
                        marginBottom: -30,
                      }
                    }
                  >
                    <P2 size={2} margin={0}>
                      Allow everyone to turn do not disturb on more easily, and
                      focus for longer periods of time.
                    </P2>
                  </Callout>
                </LeftSide>
                <RightSide inverse css={{ bottom: 0 }}>
                  <div if={isLarge} $$flex css={{ marginTop: 200 }} />
                  <P size={1.2} fontWeight={800}>
                    Preventing Shoulder Taps
                  </P>
                  <P2 size={1.5} css={isLarge && { marginRight: 90 }}>
                    Profiles are generated and aggregated across platforms.
                    Then, we show helpful details about everyone in your
                    company.
                  </P2>
                  <Callout
                    css={isLarge && { margin: [20, 0, 40, 0], left: -55 }}
                  >
                    <div $$row>
                      <P2 size={2} margin={0}>
                        Seeing recent collaboration in profiles allows less
                        pings throughout the day.
                      </P2>
                    </div>
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

// <P2 fontWeight={200} size={2.5}>
// Orbit is completely private to your desktop. It never sends any
// data outside your computer.
// </P2>
// <P2 size={2} fontWeight={200}>
// We realized early in Orbit's development that it's near
// impossible to deliver a great experience without going fully
// on-device. To avoid data privacy issues, permissions errors, and
// complex installations we spent the last year pusing the limits
// of what your desktop can do.
// </P2>

@view
class Footer {
  render() {
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <Section>
            <SectionContent padded css={isLarge && { padding: [150, 0] }}>
              <left
                css={
                  isLarge
                    ? { width: '50%', padding: [0, 100, 0, 0] }
                    : { padding: [0, 0, 50] }
                }
              >
                <SmallTitle>Our Mission</SmallTitle>
                <P2 size={1.5}>
                  Orbit runs intimately in your everyday. That means it has to
                  work for you, the individual.
                  <br />
                  <br />
                  Our goal is to build a more intuitive OS. To do that we need
                  trust. We make privacy, security, and user experience our
                  first priorities.
                </P2>
              </left>
              <RightSide noEdge>
                <BrandLogo />
              </RightSide>
            </SectionContent>
          </Section>
        )}
      </Media>
    )
  }
}

@view
export default class HomePage extends React.Component {
  render() {
    return (
      <Media query={Constants.screen.superLarge}>
        {isSuperLarge => (
          <home
            $superLarge={isSuperLarge}
            css={{ background: Constants.backgroundColor }}
          >
            <Header />
            <surround css={{ position: 'relative' }}>
              <border css={{ top: -40 }} />
              <border if={false} css={{ bottom: 0 }} />
              <Section2 />

              <Media
                query={Constants.screen.large}
                render={() => (
                  <searchIllustration
                    css={{
                      position: 'relative',
                      overflow: 'hidden',
                      top: searchYOff - 240,
                      left: '50%',
                      marginLeft: -560,
                      width: 550,
                      height: 450,
                      marginBottom: -450,
                      zIndex: 0,
                      pointerEvents: 'none',
                    }}
                  >
                    <img
                      src={slackSearchImg}
                      css={{
                        width: 1150,
                        marginTop: 0,
                        height: 'auto',
                        transformOrigin: 'top left',
                        transform: { scale: 0.5, x: 70, y: 20 },
                      }}
                    />
                    <fadeRight
                      $$fullscreen
                      css={{
                        left: 'auto',
                        width: 100,
                        zIndex: 100,
                        background: `linear-gradient(to right, transparent, ${
                          Constants.backgroundColor
                        } 80%)`,
                      }}
                    />
                    <fadeDown
                      $$fullscreen
                      css={{
                        top: 'auto',
                        height: 100,
                        zIndex: 100,
                        background: `linear-gradient(transparent, ${
                          Constants.backgroundColor
                        })`,
                      }}
                    />
                  </searchIllustration>
                )}
              />

              <Section3 />
            </surround>
            <Section4 />
            <Section6 />
            <Section7 />
            <Footer />
          </home>
        )}
      </Media>
    )
  }

  static style = {
    border: {
      position: 'absolute',
      left: 0,
      right: 0,
      borderBottom: [4, 'dotted', '#eee'],
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
    },
    superLarge: {
      transformOrigin: 'top center',
      transform: {
        scale: 1.3,
      },
    },
  }
}
