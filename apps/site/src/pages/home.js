import * as React from 'react'
import { view } from '@mcro/black'
import Logo from '~/views/logo'
import * as UI from '@mcro/ui'
import { Section, SectionContent, Slant, PurchaseButton } from '~/views'
// import homeImg from '~/../public/screen-home.png'
import profileImage from '~/../public/screen-profile.png'
import wordImage from '~/../public/screen-context-word.png'
import homeImg from '~/../public/screen-home.png'
import slackSearchImg from '~/../public/screen-slack-search.png'
import girlImg from '~/../public/video-girl.jpg'
import Observer from '@researchgate/react-intersection-observer'
import { Trail, Spring, Keyframes, animated, config } from 'react-spring'
import HeaderIllustration from './headerIllustration'
import { MailIcon } from '~/views/icons'
import * as Constants from '~/constants'

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

const Animate = {
  Wiggle: view('div', {
    display: 'inline-block',
    // transition: 'all ease-in 100ms',
    transformOrigin: 'top center',
    animation: 'wiggle 5s infinite',
  }),
}

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

const Title = ({ children, reduceCapsPct, size = 4, ...props }) => (
  <P
    size={size}
    fontWeight={700}
    margin={[0, 0, 5]}
    css={{
      fontFamily: '"Mercury Display A", "Mercury Display B"',
      fontStyle: 'italic',
      letterSpacing: size < 4 ? -1 : 0,
    }}
    {...props}
  >
    {reduceCapsPct ? changeCaps(children, reduceCapsPct) : children}
  </P>
)

const SubTitle = props => <Title size={3.5} reduceCapsPct={5} {...props} />

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

const RightSide = ({ children, inverse, noEdge, ...props }) => (
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
            ? 'polygon(26% 0%, 0% 1px, 93% 1096px)'
            : 'polygon(0% 0%, 90px 0%, 0% 1096px)',
          float: 'left',
          width: 147,
          height: 990,
          marginLeft: -30,
        }}
      />
      {children}
    </inner>
    {noEdge && children}
  </rightSide>
)

const LeftSide = ({ children, noEdge, inverse, ...props }) => (
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

const WavyLine = ({ height, ...props }) => (
  <svg width={60} height={height} {...props}>
    <rect
      style={{ fill: 'url(#wavy-line)' }}
      width={60}
      height={height}
      x="0"
      y="0"
    />
  </svg>
)

const brandColor = Constants.colorMain || UI.color('#9D36E2')

const Cmd = view('span', {
  padding: [2, 5],
  margin: [-2, 0],
  border: [1, '#ccc'],
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

const Callout = UI.injectTheme(({ style, theme, ...props }) => (
  <section
    css={{
      border: [1, [255, 255, 255, 0.3]],
      zIndex: 10,
      overflow: 'hidden',
      position: 'relative',
    }}
    style={style}
  >
    <Lines
      width={1000}
      height={2000}
      css={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: -2,
        opacity: 0.025,
        transformOrigin: 'top left',
        transform: {
          scale: 4,
        },
      }}
    />
    <innerSection
      css={{
        margin: 6,
        // borderRadius: 5,
        padding: [30, 32],
        background: theme.base.background,
        overflow: 'hidden',
        position: 'relative',
      }}
      {...props}
    />
  </section>
))

const P = props => <UI.Text selectable css={{ display: 'block' }} {...props} />
const P2 = props => <P size={2} alpha={0.9} margin={[0, 0, 20]} {...props} />
const Ul = view('span', {
  display: 'inline-block',
  borderBottom: [3, 'rgba(136, 231, 234, 0.9)'],
  marginBottom: -3,
})
const Ul2 = view('span', {
  display: 'inline-block',
  borderBottom: [1, 'dotted', '#ddd'],
  marginBottom: -1,
})
const Hl = view('span', {
  background: UI.color('yellow').alpha(0.8),
  padding: [0, 2],
  margin: [0, -2],
  borderRadius: 3,
  color: '#000',
})

@view
class BrandLogo {
  render() {
    return (
      <brandMark>
        <Logo size={0.32} color={brandColor} />
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
      padding: 20,
      margin: -20,
      alignItems: 'center',
      textAlign: 'center',
    },
  }
}

const altColor = '#D4C042'

@view
class Header {
  render() {
    return (
      <Section>
        <SectionContent padded fullscreen>
          <Slant
            slantBackground={`linear-gradient(200deg, ${Constants.colorSecondary.darken(
              0.15,
            )} 5%, ${Constants.colorSecondary} 95%)`}
          />
          <glowContain
            css={{
              position: 'absolute',
              top: -200,
              left: -100,
              bottom: 0,
              right: '50%',
              zIndex: 1,
              overflow: 'hidden',
              transform: {
                rotate: '5deg',
              },
            }}
          >
            <glow
              css={{
                position: 'absolute',
                top: '42%',
                right: 0,
                marginRight: -170,
                background: '#000',
                opacity: 0.15,
                width: 350,
                height: 300,
                borderRadius: 100,
                filter: {
                  blur: 120,
                },
              }}
            />
          </glowContain>
          <top $$row>
            <BrandLogo />
            <div $$flex />
          </top>
          <div $$flex />
          <Callout
            css={{
              width: '55%',
              margin: [-90, 0, 0, -50],
            }}
          >
            <Title reduceCapsPct={10} size={5.8} margin={0}>
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
            <P size={2} alpha={0.75} margin={[0, 0, 20]}>
              <span if={false} css={{ color: '#000' }} />
              Sort the cloud to keep your team in sync.<br />
              Desktop news, search and more.
            </P>

            <DottedButton css={{ margin: [8, -12, -8, 'auto'] }}>
              Install in 3 minutes{' '}
              <AppleLogo
                width={20}
                height={20}
                css={{
                  display: 'inline-block',
                  margin: [-5, 0, 0, 5],
                  opacity: 0.32,
                }}
              />
            </DottedButton>
          </Callout>

          <div $$flex />

          <rightSide>
            <HeaderIllustration />
          </rightSide>

          <videos
            css={{
              position: 'absolute',
              top: -22,
              right: 100,
              width: 200,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
            }}
          >
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
                css={{ zIndex: 100, position: 'absolute', top: 120, left: 200 }}
              />
              <P selectable={false} size={4.5} margin={0}>
                Watch the 30s<br /> introduction
              </P>
            </videoSpot>
          </videos>
        </SectionContent>
      </Section>
    )
  }

  static style = {
    header: {
      padding: 25,
      position: 'relative',
    },
    videoSpot: {
      cursor: 'pointer',
      flexFlow: 'row',
      alignItems: 'center',
      transformOrigin: 'center center',
      transform: { scale: 0.25 },
      transition: 'all linear 100ms',
      '&:hover': { transform: { scale: 0.26 } },
    },
    girlImg: {
      margin: [0, 60, 0, 0],
      boxShadow: [[0, 0, 90, [0, 0, 0, 0.1]]],
    },
    top: {
      flexFlow: 'row',
      zIndex: 100,
      position: 'relative',
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

const Num = view('div', {
  position: 'absolute',
  height: 100,
  width: 100,
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fff',
  border: [1, 'dotted', '#eee'],
  color: '#ccc',
  fontWeight: 100,
  fontSize: 62,
  borderRadius: 1000,
  zIndex: 1,
})

const sleep = ms => new Promise(res => setTimeout(res, ms))

const newsIllYOffset = 60
const searchYOff = -40
const contextYOff = 160

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
    console.log('hide notifs')
    this.setState({ showNotifs: false })
    await sleep(2000)
    console.log('show orbit')
    this.setState({ showOrbit: true })
  }

  render() {
    const { showOrbit, showNotifs } = this.state

    return (
      <UI.Theme name="light">
        <Section inverse>
          <SectionContent padded fullscreen>
            <Slant inverseSlant />
            <LeftSide>
              <Observer onChange={this.handleIntersect}>
                <content css={{ display: 'block', marginTop: 0 }}>
                  <SmallTitle css={{ marginBottom: 15 }}>
                    How Orbit Works
                  </SmallTitle>
                  <SubTitle>Personal News</SubTitle>
                  <P2
                    size={1.8}
                    css={{
                      marginBottom: 30,
                    }}
                  >
                    Sync up with <Cmd>⌘+Space</Cmd>
                  </P2>
                  <Callout
                    css={{ width: 550, position: 'absolute', right: -20 }}
                  >
                    <P2 size={1.6} css={{ textAlign: 'left' }} margin={0}>
                      Your team uses the best tool for the job. But between all
                      the services, that can lead to a pretty messy big picture.
                      <vertSpace css={{ height: 20 }} />
                      Stay focused by peeking at what's important now. No more
                      notification overload, just well summarized news that's
                      relevant to you.
                      <vertSpace css={{ height: 20 }} />
                      Powered by on-device ML.{' '}
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
              <notifications>
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
                        top: newsIllYOffset + 20,
                        right: -700,
                        width: 1100,
                        height: 'auto',
                        transformOrigin: 'top left',
                        transform: {
                          scale: 0.4,
                        },
                        boxShadow: [[0, 15, 120, [0, 0, 0, 0.1]]],
                      }}
                    />
                  </animated.div>
                )}
              </Spring>

              <fadeRight
                $$fullscreen
                css={{
                  left: '92%',
                  zIndex: 100,
                  background: `linear-gradient(to right, transparent, ${
                    Constants.backgroundColor
                  })`,
                }}
              />

              <fadeawayfadeawayfadeaway
                css={{
                  position: 'absolute',
                  top: newsIllYOffset + 500,
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

              <secondSection>
                <div css={{ height: searchYOff + 800 }} />
                <content
                  css={{
                    display: 'block',
                    background: Constants.backgroundColor,
                  }}
                >
                  <SubTitle>Search</SubTitle>
                  <P2 size={1.8}>All your integrations in one place</P2>
                </content>
              </secondSection>
            </RightSide>
          </SectionContent>
        </Section>
      </UI.Theme>
    )
  }

  static style = {
    main: {
      width: 450,
      flex: 1,
    },
    notifications: {
      position: 'absolute',
      top: 200,
      right: 100,
      width: 300,
      bottom: 150,
      zIndex: 1,
    },
    secondSection: {
      position: 'relative',
      display: 'block',
      zIndex: 101,
    },
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
        <Section>
          <SectionContent fullscreen padded>
            <Slant css={{ zIndex: 2 }} />
            <LeftSide inverse>
              <div
                css={{
                  display: 'block',
                  margin: [contextYOff + 120, 0, 0, 30],
                }}
              >
                <SubTitle>
                  Augmented<br />intelligence
                </SubTitle>
                <P2
                  size={1.8}
                  css={{
                    marginBottom: 30,
                  }}
                >
                  Always on contextual answers
                </P2>
                <Callout css={{ width: 550, position: 'absolute', right: 10 }}>
                  <P2 size={1.6} css={{ textAlign: 'left', margin: 0 }}>
                    Email, chat, tickets. All day you communicate. Orbit
                    attaches to every app, providing <em>realtime</em> relevant
                    answers based on what you're doing.
                    <vertSpace css={{ height: 20 }} />
                    Simply hold <Cmd>Option</Cmd>. Important terms, people, and
                    items in your cloud are shown instantly.
                    <vertSpace css={{ height: 20 }} />
                    Orbit finds answers automatically.
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
            <RightSide css={{ top: 0, overflow: 'visible' }}>
              <Callout
                css={{
                  width: 500,
                  position: 'absolute',
                  top: searchYOff - 55,
                  left: 40,
                }}
              >
                <P2 size={1.6} css={{ textAlign: 'left', margin: 0 }}>
                  It's not just search across the entire cloud, it's incredibly
                  fast conceptual search that sorts everything from Slack
                  conversations to local files.
                  <vertSpace css={{ height: 20 }} />
                  Get more from your knowledge by putting it at your fingertips.
                </P2>
              </Callout>
            </RightSide>

            <RightSide
              css={{ zIndex: 0, overflow: 'hidden', top: 0, bottom: 0 }}
            >
              <Spring from={{ x: 100 }} to={{ x: 10 }}>
                {({ x }) => (
                  <animated.div
                    style={{
                      transform: `translate3d(${x}px,0,0)`,
                    }}
                  >
                    <img
                      src={wordImage}
                      css={{
                        position: 'absolute',
                        width: 1634,
                        marginLeft: -300,
                        height: 'auto',
                        transformOrigin: 'top left',
                        transform: {
                          scale: 0.35,
                          x: 350,
                          y: contextYOff + 950,
                        },
                      }}
                    />
                  </animated.div>
                )}
              </Spring>

              <fadeDown
                $$fullscreen
                css={{
                  top: Constants.SECTION_HEIGHT - 100 - contextYOff,
                  height: 200,
                  zIndex: 100,
                  background: `linear-gradient(transparent, ${
                    Constants.backgroundColor
                  } 95%)`,
                }}
              />
            </RightSide>
          </SectionContent>
        </Section>
      </UI.Theme>
    )
  }
}

const altBg = UI.color('#FCF6ED')

@view
class Section4 {
  render() {
    return (
      <UI.Theme name="light">
        <Section inverse css={{ background: altBg }}>
          <SectionContent fullscreen padded css={{ zIndex: 3 }}>
            <Slant
              inverseSlant
              slantBackground={`linear-gradient(200deg, ${altBg.darken(
                0.1,
              )} 5%, ${altBg.darken(0.15)} 95%)`}
              css={{ zIndex: 2 }}
            />
            <LeftSide>
              <SmallTitle
                color={altBg.darken(0.55).desaturate(0.2)}
                margin={[0, 0, 10]}
              >
                Use Cases
              </SmallTitle>
              <SubTitle color={altBg.darken(0.7).desaturate(0.2)}>
                Reducing<br />
                workplace<br />
                interruptions
              </SubTitle>
              <P2 size={1.8} css={{ paddingLeft: 50 }}>
                Orbit focuses on the individual<br /> to make teams less
                interrupted.
              </P2>
              <div css={{ height: 220 }} />
              <P size={1.2} fontWeight={800}>
                Turning Down Notifications
              </P>
              <P2 size={1.5} css={{ margin: [0, 0, 25, 90] }}>
                The Orbit home page is designed around picking the right things
                to show you based on how you work. It's summarization also lets
                you glance to see what's new.
              </P2>
              <Callout
                css={{
                  width: 460,
                  marginLeft: 120,
                  marginBottom: -30,
                }}
              >
                <P2 size={2} margin={0}>
                  Allow everyone to turn do not disturb on more easily, and
                  focus for longer periods of time.
                </P2>
              </Callout>
            </LeftSide>
            <RightSide inverse css={{ bottom: 0 }}>
              <div $$flex css={{ marginTop: 200 }} />
              <P size={1.2} fontWeight={800}>
                Preventing Shoulder Taps
              </P>
              <P2 size={1.5} css={{ marginRight: 90 }}>
                Profiles are generated and aggregated across platforms. Then, we
                show helpful details about everyone in your company.
              </P2>
              <Callout css={{ margin: [20, 0, 40, 0], left: -55 }}>
                <div $$row>
                  <P2 size={2} margin={0}>
                    Seeing recent collaboration in profiles allows less pings
                    throughout the day.
                  </P2>
                </div>
              </Callout>
              <br />
              <br />
              <br />
              <content if={false}>
                <P2 size={3}>Make your success team more successful.</P2>
                <P2 size={1.8}>
                  Orbit works alongside Intercom and Zendesk. Your
                  knowledgebase, recently closed tickets and docs now power
                  live, automatic answers as you chat.
                </P2>
              </content>
            </RightSide>
          </SectionContent>
        </Section>
      </UI.Theme>
    )
  }

  static style = {
    main: {
      width: 450,
      flex: 1,
    },
  }
}

@view
class Section5 {
  render() {
    return (
      <UI.Theme name="light">
        <Section css={{ background: altBg }}>
          <SectionContent fullscreen padded>
            <Slant
              slantBackground={`linear-gradient(200deg, ${altBg.darken(
                0.15,
              )} 5%, ${altBg} 95%)`}
              css={{ zIndex: 2 }}
            />
            <LeftSide inverse>
              <content
                css={{
                  display: 'block',
                  textAlign: 'right',
                  margin: [150, 0, 100, 40],
                }}
              >
                <P2 size={2.2}>
                  Inspired by solutions like <Ul>Stripe Home</Ul>, we made a
                  beautiful, practical home for your company.
                </P2>
                <br />
                <P2 if={false} size={1.6}>
                  Intranet systems are the unloved, and oft ignored pieces of a
                  company.
                </P2>
              </content>
            </LeftSide>
            <example
              css={{
                position: 'absolute',
                top: 80,
                right: 0,
                bottom: 0,
                left: '53%',
                overflow: 'hidden',
                zIndex: 10,
              }}
            >
              <img
                src={profileImage}
                width={1199}
                height="auto"
                css={{
                  transformOrigin: 'top left',
                  transform: { scale: 0.5 },
                }}
              />
              <fadeRight
                $$fullscreen
                css={{
                  left: 'auto',
                  width: 100,
                  zIndex: 100,
                  background: `linear-gradient(to right, transparent, ${altBg} 80%)`,
                }}
              />
              <fadeDown
                $$fullscreen
                css={{
                  top: 'auto',
                  height: 300,
                  bottom: 250,
                  zIndex: 100,
                  background: `linear-gradient(transparent, ${altBg} 90%)`,
                }}
              />
            </example>
          </SectionContent>
        </Section>
      </UI.Theme>
    )
  }

  static style = {
    ul: {
      margin: 0,
      overflow: 'hidden',
    },
    li: {
      display: 'flex',
      flexFlow: 'row',
      alignItems: 'flex-start',
      fontSize: 22,
      padding: [0, 0, 10, 0],
    },
    icon: {
      marginTop: 6,
      marginRight: 12,
    },
  }
}

const alt2Bg = UI.color('#3b4a91')

@view
class Section6 {
  render() {
    return (
      <UI.Theme name="dark">
        <Section css={{ background: alt2Bg }}>
          <SectionContent fullscreen padded>
            <Slant slantBackground={alt2Bg.darken(0.15)} />
            <LeftSide inverse>
              <SmallTitle alpha={0.5} margin={[0, 0, 10]}>
                Use Cases
              </SmallTitle>
              <Title>
                Customer<br />Success<br />Accuracy
              </Title>
              <div css={{ height: 240 }} />
              <P size={1.2} fontWeight={800}>
                Faster Responses for Support
              </P>
              <P2 size={1.5} css={{ margin: [0, 0, 25, 90] }}>
                Orbit's contextual answers work with your support software as
                your team chats. In realtime it searches knowledge and
                highlights the exact section with a potential answer.
              </P2>
              <Callout
                css={{
                  width: 460,
                  marginLeft: 80,
                  marginBottom: -30,
                }}
              >
                <P2 size={2} margin={0}>
                  Answers on hand for your entire success team, powered by all
                  your knowledgebase.
                </P2>
              </Callout>
            </LeftSide>
            <RightSide>
              <div $$flex css={{ marginTop: 200 }} />
              <P size={1.2} fontWeight={800}>
                Reduced Onboarding for Sales
              </P>
              <P2 size={1.5} css={{ marginRight: 90 }}>
                Sales requires intimate knowledge of your product. Orbit can sit
                side by side with your success team as they chat on Intercom or
                ZenDesk providing realtime answers from your knowledgebase.
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
      <Section>
        <SectionContent css={{ padding: [150, 0] }}>
          <left css={{ width: '50%', padding: [0, 100, 0, 0] }}>
            <SmallTitle>Our Mission</SmallTitle>
            <P2 size={1.5}>
              Orbit runs intimately in your everyday. That means it has to work
              for you, the individual.
              <br />
              <br />
              Our goal is to build a smarter and more intuitive OS. To do that
              we need trust. We make privacy, security, and user experience our
              first priorities.
            </P2>
          </left>
          <RightSide noEdge>
            <BrandLogo />
          </RightSide>
        </SectionContent>
      </Section>
    )
  }
}

@view
export default class HomePage extends React.Component {
  render() {
    return (
      <home css={{ background: Constants.backgroundColor }}>
        <Header />
        <surround css={{ position: 'relative' }}>
          <border css={{ top: -40 }} />
          <border if={false} css={{ bottom: 0 }} />
          <Section2 />
          <searchIllustration
            css={{
              position: 'relative',
              overflow: 'hidden',
              top: -220,
              left: '50%',
              marginLeft: -560,
              width: 550,
              height: 450,
              marginBottom: -450,
              zIndex: 0,
            }}
          >
            <img
              src={slackSearchImg}
              css={{
                width: 1150,
                marginTop: 0,
                height: 'auto',
                transformOrigin: 'top left',
                transform: { scale: 0.5, x: 70, y: searchYOff + 20 },
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
          <Section3 />
        </surround>
        <Section4 />
        <Section6 />
        <Footer />
      </home>
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
      zIndex: 0,
      margin: [0, 'auto'],
      alignItems: 'center',
      pointerEvents: 'none',
    },
  }
}
