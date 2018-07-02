import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Header, Footer } from '~/components'
import SectionContent from '~/views/sectionContent'
import Router from '~/router'
import * as View from '~/views'
import { Slant, Title, P, AppleLogo, HomeImg, WindowsLogo } from '~/views'
import * as Constants from '~/constants'
import Media from 'react-media'
import { scrollTo } from '~/helpers'
import { Join } from '~/components/Join'
import { Bauhaus } from '~/views/bauhaus'
import { Parallax, ParallaxLayer } from '~/components/Parallax'
import profileImg from '~/../public/profileimg.png'
import { Icon } from '~/views/icon'
// import orbitVideo from '~/../public/orbit.mp4'
import * as _ from 'lodash'
import { Spring } from 'react-spring'
import { SVGToImage } from '~/views/svgToImage'

const forwardRef = Component => {
  return React.forwardRef((props, ref) => (
    <Component {...props} forwardRef={ref} />
  ))
}

const bodyBg = Constants.colorMain
const bottomBg = Constants.colorMain.lighten(0.1).desaturate(0.1)
const waveColor = '#C4C4F4'

class WindowResize extends React.Component {
  componentDidMount() {
    document.documentElement.addEventListener('resize', this.handleResize)
    this.handleResizeFast()
  }

  componentWillUnmount() {
    document.documentElement.removeEventListener('resize', this.handleResize)
  }

  handleResizeFast = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight })
  }

  handleResize = _.debounce(this.handleResizeFast, 64)

  render() {
    return this.props.children(this.state)
  }
}

const SectionTitle = props => (
  <Title
    css={{ marginRight: 100 }}
    italic
    size={4}
    alpha={1}
    color="#222"
    {...props}
  />
)

const SectionTitleSmall = props => <SectionTitle size={3.1} {...props} />

const SectionP = props => (
  <P
    size={2.1}
    sizeLineHeight={1.1}
    fontWeight={400}
    titleFont
    color="#fff"
    alpha={1}
    {...props}
  />
)

const SectionSubP = props => (
  <P
    size={1.7}
    sizeLineHeight={1.1}
    fontWeight={300}
    titleFont
    color="#fff"
    alpha={0.9}
    {...props}
  />
)

const Half = props => (
  <Media query={Constants.screen.large}>
    {isLarge => (
      <half
        css={
          isLarge
            ? { width: '45%', margin: ['auto', 0] }
            : { width: '100%', margin: ['auto', 0] }
        }
        {...props}
      />
    )}
  </Media>
)

const WaveBanner = forwardRef(({ forwardRef, fill = '#000', ...props }) => (
  <svg
    ref={forwardRef}
    className="wavebanner"
    preserveAspectRatio="none"
    viewBox="0 0 3701 2273"
    width="100%"
    height="105%"
    css={{
      minWidth: 1000,
      margin: [
        '-2.5%',
        window.innerWidth < 1000 ? (window.innerWidth - 1000) / 2 : 0,
        0,
      ],
      transform: {
        scaleX: -1,
        z: 0,
      },
    }}
    {...props}
  >
    <path
      d="M0,55.59375 C212.979167,113.239583 555.390625,138.213542 1027.23438,130.515625 C1735,118.96875 2001.85938,27.1875 2637.45312,6.890625 C3061.18229,-6.640625 3415.69792,1.0625 3701,30 L3701,2197 C3532.39583,2141.58333 3222.74479,2116.04167 2772.04687,2120.375 C2096,2126.875 1777.21875,2273.0625 1131.75,2273.17188 C701.4375,2273.24479 324.1875,2247.85417 0,2197 L0,55.59375 Z"
      id="Rectangle"
      fill={fill}
    />
  </svg>
))

const ToolTip = ({ tooltip, tooltipProps, ...props }) => (
  <UI.Surface
    inline
    background="transparent"
    tooltip={
      <UI.Text if={tooltip} size={1.2} alpha={0.8} {...tooltipProps}>
        {tooltip}
      </UI.Text>
    }
    css={{
      cursor: 'pointer',
      // margin: [0, -5],
    }}
    {...props}
  />
)

const SectionContentParallax = props => (
  <SectionContent css={{ height: '100%' }} {...props} />
)

const scrollToTrack = (to, track) => {
  return () => {
    window.ga('send', 'event', 'Home', 'download', track)
    scrollTo(to)()
  }
}

const NormalLayer = view.attach('homeStore')(({ homeStore, ...props }) => {
  return <SectionContent css={{ height: homeStore.sectionHeight }} {...props} />
})

@view
class Page extends React.Component {
  render({
    offset,
    title,
    titleProps,
    children,
    background,
    backgroundProps,
    banner,
    zIndex = 0,
  }) {
    const baseZIndex = zIndex
    const Parallax = ({ zIndex = 0, ...props }) => (
      <ParallaxLayer
        className="parallaxLayer"
        offset={offset}
        speed={0.2}
        css={{ zIndex: zIndex + baseZIndex }}
        {...props}
      />
    )
    const Content = props => (
      <NormalLayer
        css={{ position: 'relative', zIndex: 1 + zIndex }}
        {...props}
      />
    )
    return (
      <React.Fragment>
        <ParallaxLayer
          if={banner}
          className="parallaxLayer banner"
          offset={offset}
          speed={0.05}
          css={{
            zIndex: 0 + zIndex,
          }}
          {...backgroundProps}
        >
          <WaveBanner fill={banner} />
        </ParallaxLayer>
        <ParallaxLayer
          className="parallaxLayer background"
          if={background}
          offset={offset}
          speed={0.1}
          css={{
            zIndex: -1 + zIndex,
          }}
          {...backgroundProps}
        >
          {background}
        </ParallaxLayer>
        <ParallaxLayer
          className="parallaxLayer title"
          css={{
            zIndex: 2 + zIndex,
          }}
          if={title}
          offset={offset}
          speed={-0.02}
          {...titleProps}
        >
          <SectionContentParallax>{title}</SectionContentParallax>
        </ParallaxLayer>
        {typeof children === 'function' ? (
          children({ Parallax, Content })
        ) : (
          <Content>{children}</Content>
        )}
      </React.Fragment>
    )
  }
}

const borderize = bg => bg.darken(0.2).alpha(0.5)
const topSlants = {
  slantGradient: [
    'transparent',
    borderize(bottomBg.mix(bodyBg)),
    'transparent',
  ],
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

const VertSpace = () => (
  <Media query={Constants.screen.tall}>
    {isTall => <div css={{ height: isTall ? 20 : 10 }} />}
  </Media>
)

const SectionSubTitle = props => (
  <P
    size={1.9}
    sizeLineHeight={1.1}
    titleFont
    alpha={0.65}
    fontWeight={400}
    {...props}
  />
)

const Pitch = ({ isLarge, scrollTo }) => (
  <>
    <Title italic size={5} alpha={1} color="#222">
      Instant-on Intranet
    </Title>
    <VertSpace />
    <SectionSubTitle>
      The search platform for everything in your cloud and behind your firewall.
      Installed in a minute with{' '}
      <ToolTip onClick={() => scrollTo(3)}>total&nbsp;privacy</ToolTip>.
    </SectionSubTitle>
    <VertSpace />
    <VertSpace />
    <row $$row css={{ margin: [2, 0, 10] }}>
      <Join />
      <div $$flex />
    </row>
    <VertSpace />
    <actions
      $$row
      css={{
        margin: isLarge ? [0, 'auto', 0, 0] : [20, 0, 0, 0],
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
        css={{ cursor: 'pointer', margin: [-2, 0] }}
      >
        Learn more.
      </UI.Button>
    </actions>
  </>
)

@view
class HomeHeader extends React.Component {
  render({ scrollTo }) {
    return (
      <Page offset={0}>
        {({ Parallax, Content }) => (
          <>
            {/* <Glow
              style={{
                background: '#fff',
                opacity: 0.8,
                transform: { x: '-65%', y: '-20%', scale: 1 },
              }}
            /> */}
            <Parallax speed={0.1}>
              <Bauhaus
                showCircle
                circleColor="#F7C7FF"
                css={{
                  opacity: 0.25,
                  transform: { scale: 0.97, y: '-11%', x: '54%' },
                }}
                warp={([x, y]) => [
                  x - 4 * -Math.sin(x / 30),
                  y - 4 * -Math.sin(x / 30),
                ]}
              />
            </Parallax>
            <Content id="home-header">
              <Slant {...firstSlant} {...topSlants} />
              <Slant inverseSlant {...secondSlant} {...topSlants} />
              <Slant {...thirdSlant} {...topSlants} />
              <Media
                query={Constants.screen.small}
                render={() => (
                  <>
                    <div $$flex />
                    <Pitch scrollTo={scrollTo} />
                    <div $$flex={2.5} />
                    <orbit
                      css={{
                        zIndex: -1,
                        position: 'absolute',
                        bottom: '-10%',
                        margin: [0, 'auto'],
                        transformOrigin: 'bottom center',
                        transform: { scale: 0.6 },
                      }}
                    >
                      {/* small */}
                      <UI.TiltHoverGlow
                        restingPosition={[100, 100]}
                        glowProps={{
                          opacity: 0.5,
                        }}
                      >
                        <HomeImg />
                      </UI.TiltHoverGlow>
                    </orbit>
                  </>
                )}
              />
              <Media
                query={Constants.screen.large}
                render={() => (
                  <>
                    <inner
                      css={{
                        flex: 1,
                        textAlign: 'left',
                        width: '40%',
                      }}
                    >
                      <div $$flex={1.2} />
                      <Pitch isLarge scrollTo={scrollTo} />
                      <div $$flex />
                    </inner>
                  </>
                )}
              />
            </Content>
          </>
        )}
      </Page>
    )
  }
}

@view
class SectionSearch extends React.Component {
  render({ isTall, isLarge, sectionHeight }) {
    const iconProps = {
      size: isLarge ? 50 : 40,
    }
    return (
      <Page
        offset={1}
        banner={waveColor}
        titleProps={{
          // seems opacity effect causes paints... shouldnt be bad test uncomment in fuutre
          effects: {
            opacity: x => {
              const fadeAfter = 1.2
              if (x < fadeAfter) {
                return x * Math.log(x * 10)
              }
              return fadeAfter * 2 - x
            },
          },
        }}
        title={
          <Half>
            <SectionTitle
              color={UI.color(waveColor)
                .darken(0.6)
                .desaturate(0.6)}
            >
              Unified search that works
            </SectionTitle>
            <VertSpace />
            <SectionP>
              Don't trust your data to us. The power of novel{' '}
              <ToolTip tooltip="Orbit uses novel on-device machine learning to power conceptural, summarized search.">
                on-device NLP
              </ToolTip>{' '}
              means your internal search platform is really yours.
            </SectionP>
            <VertSpace />
            <SectionSubP>
              Search cloud services like Slack and Google Drive just as easily
              as internal APIs, databases and files.
            </SectionSubP>
            <VertSpace />
            <SectionSubP size={1.3} alpha={0.8}>
              <View.LinkSimple to="/about">
                Learn more about how it works.
              </View.LinkSimple>
            </SectionSubP>
            <VertSpace />
            <VertSpace />
            <div css={{ height: 200 }} />
          </Half>
        }
      >
        {({ Parallax, Content }) => (
          <>
            <Parallax speed={0.3} zIndex={-1}>
              <Bauhaus
                showTriangle
                css={{
                  transformOrigin: 'top left',
                  transform: { scale: 0.4, y: -sectionHeight * 0.75, x: '0%' },
                  opacity: 0.1,
                }}
              />
            </Parallax>
            <Content id="home-search">
              <div $$flex={3} />
              <Half>
                <icons
                  css={{
                    transformOrigin: 'bottom left',
                    transform: {
                      scale: isTall ? 1.4 : 1,
                      z: 0,
                    },
                  }}
                >
                  <icon>
                    <Icon name="slack" {...iconProps} />
                  </icon>
                  <icon>
                    <Icon name="gdocs" {...iconProps} />
                  </icon>
                  <icon>
                    <Icon name="gmail" {...iconProps} />
                  </icon>
                  <icon>
                    <Icon name="github" {...iconProps} />
                  </icon>
                  <icon>
                    <Icon name="gcalendar" {...iconProps} />
                  </icon>
                  <icon>
                    <Icon name="confluence" {...iconProps} />
                  </icon>
                  <icon>
                    <Icon name="jira" {...iconProps} />
                  </icon>
                  <icon>
                    <Icon name="dropbox" {...iconProps} />
                  </icon>
                </icons>
              </Half>
              <div $$flex />
            </Content>
          </>
        )}
      </Page>
    )
  }

  static style = {
    icons: {
      flexFlow: 'row',
    },
    icon: {
      margin: [0, 20, 0, 0],
      background: UI.color(waveColor)
        .darken(0.2)
        .alpha(0.1),
      borderRadius: 10,
      padding: 20,
    },
  }
}

@view
class SectionProfiles extends React.Component {
  render({ isLarge }) {
    return (
      <Page
        offset={2}
        background={
          <>
            {/* <Bauhaus showSquare css={{ opacity: 1 }} /> */}
            <Slant {...firstSlant} {...topSlants} />
            <Slant inverseSlant {...secondSlant} {...topSlants} />
            <Slant {...thirdSlant} {...topSlants} />
          </>
        }
        childrenProps={{
          style: {
            zIndex: 4,
          },
        }}
      >
        <SectionContent id="home-profiles" css={{ flex: 1 }}>
          <inner
            className="profiles"
            css={isLarge && { width: '45%', margin: ['6%', 0, 0] }}
          >
            <SectionTitleSmall size={2.5}>
              People first exploration
            </SectionTitleSmall>
            <VertSpace />
            <SectionSubP color="#111" alpha={0.5}>
              Beautiful profiles to keep everyone in sync. See recent
              collaborations, expert topics, and relevant activity from across
              your cloud.
            </SectionSubP>
            <VertSpace />
            <VertSpace />
          </inner>
          <div $$flex />
          <wrap css={{ position: 'relative' }}>
            <fadeBottom
              css={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: `linear-gradient(transparent, ${bodyBg} 70%)`,
                zIndex: 100,
              }}
            />
            <img
              src={profileImg}
              css={{
                width: 1283 / 2,
                height: 'auto',
                transform: {
                  y: 0,
                  x: 0,
                  perspective: 1000,
                  rotateY: '3deg',
                  rotateX: '4deg',
                  rotateZ: '-1deg',
                },
              }}
            />
          </wrap>
        </SectionContent>
      </Page>
    )
  }
}

const Card = ({ title, children, icon }) => (
  <card
    css={{
      flexFlow: 'row',
      padding: [28, 32],
      background: [0, 0, 0, 0.05],
      margin: [0, 0, 25],
      borderRadius: 10,
      alignItems: 'center',
    }}
  >
    <UI.Icon
      name={icon}
      size={46}
      color="#fff"
      css={{ margin: [0, 40, 0, 0] }}
    />
    <content css={{ flex: 1 }}>
      <SectionP size={1.7} fontWeight={700} css={{ flex: 1 }}>
        {title}
      </SectionP>
      <SectionSubP size={1.8} sizeLineHeight={1} css={{ flex: 1 }}>
        {children}
      </SectionSubP>
    </content>
  </card>
)

@view
class SectionNoCloud extends React.Component {
  render({ homeStore, isLarge }) {
    return (
      <section
        css={{
          height: homeStore.sectionHeight,
          position: 'relative',
          zIndex: 1000,
        }}
      >
        <SVGToImage>
          <WaveBanner
            css={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 0,
            }}
            fill="#79bdd1"
          />
        </SVGToImage>
        <SectionContent css={{ flex: 1 }}>
          <Bauhaus
            showCircle
            css={{
              zIndex: 0,
              opacity: 0.2,
              transform: { y: '40%', x: '80%', scale: 0.7 },
            }}
          />
          <div
            css={{
              flexFlow: isLarge ? 'row' : 'column',
              justifyContent: isLarge ? 'space-around' : 'center',
              flex: 1,
            }}
          >
            <inner css={isLarge && { width: '46%', margin: ['auto', 0] }}>
              <SectionTitle color="#fff">The No-Cloud Platform</SectionTitle>
              <VertSpace />
              <SectionSubTitle color="#fff" alpha={0.8}>
                No servers and no setup means absolute data security,
                sweat-free.
              </SectionSubTitle>
              <VertSpace />
              <SectionSubP>
                Orbit is a new type of internal tool that keeps your data
                completely on-device. It's a powerful platform for internal
                knowledge and apps, entirely behind your firewall.
              </SectionSubP>
              <VertSpace />
              <SectionSubP alpha={0.7}>
                We've rethought the intranet from the ground up. It starts by
                putting users and privacy first.
              </SectionSubP>
              <VertSpace />
              <VertSpace />
              <VertSpace />
              <space css={{ margin: [0, 'auto'] }}>
                <SectionSubP size={3}>🙅‍ ☁️ = 🙅‍♂️ 😅</SectionSubP>
              </space>
              {/* <Bauhaus showCircle showTriangle showSquare /> */}
              <VertSpace />
              <VertSpace />
            </inner>
            <inner css={isLarge && { width: '38%', margin: ['auto', 0] }}>
              <Card icon="lock" title="Complete Security">
                Your data never leaves your firewall.
              </Card>
              <Card icon="userrun" title="Instant Setup">
                Download to setup in just a couple minutes.
              </Card>
              <Card icon="business_plug" title="Your Control">
                One-click to deploy custom private apps.
              </Card>
            </inner>
          </div>
        </SectionContent>
      </section>
    )
  }
}

const pages = 3

class VideoStore {
  run = null

  onKeyframes = run => {
    this.run = run
    this.run(Spring, {
      from: { y: 0 },
      to: { y: 0 },
    })
  }

  // animateOrbit = react(
  //   () => this.props.homeStore.visibleIndex,
  //   index => {
  //     this.run(Spring, {
  //       from: { y: 0 },
  //       to: { y: index * this.props.homeStore.sectionHeight },
  //       config: config.slow,
  //     })
  //   },
  // )
}

@view.attach('homeStore')
@view({
  store: VideoStore,
})
class Video extends React.Component {
  render({ homeStore }) {
    const { orbitStopAt } = homeStore
    return (
      <ParallaxLayer
        className="parallaxLayer"
        offset={0}
        speed={-0.9}
        scrollTop={typeof orbitStopAt !== 'number' ? false : orbitStopAt}
        css={{ zIndex: 1000 }}
      >
        <div
          css={{
            zIndex: 10,
            pointerEvents: 'none',
            position: 'absolute',
            right: 0,
            top: 0,
            width: '50%',
          }}
        >
          <wrap
            css={{
              pointerEvents: 'all',
              width: 1100 / 2,
              height: 2014 / 2,
              transform: {
                x: 70,
                y: '15%',
                z: 0,
              },
            }}
          >
            <UI.TiltHoverGlow
              hideShadow
              restingPosition={[100, 100]}
              tiltOptions={{ perspective: 1500 }}
              css={{
                borderRadius: 17,
                boxShadow: [[12, 23, 80, [0, 0, 0, 0.15]]],
              }}
              glowProps={{
                opacity: 0.5,
              }}
            >
              <HomeImg />
            </UI.TiltHoverGlow>
          </wrap>
        </div>
      </ParallaxLayer>
    )
  }
}

const visiblePosition = (node, pct = 0.8) => {
  const { y } = node.getBoundingClientRect()
  const max = node.clientHeight - node.clientHeight * pct
  // active
  if (Math.abs(y) <= max) {
    return 1
  }
  // past
  if (y < 0) {
    return 2
  }
  return 0
}

// const objMap = (obj, fn) =>
//   Object.keys(obj).reduce(
//     (acc, key) => ({
//       ...acc,
//       [key]: fn(obj[key]),
//     }),
//     {},
//   )

@view.provide({
  homeStore: class VideoStore {
    nodes = []
    nodeOffsets = []
    visible = []
    scrollTop = document.documentElement.scrollTop

    get sectionHeight() {
      return this.props.sectionHeight
    }

    orbitStopAfter = null

    get orbitStopAt() {
      let visibleIndex = this.visible.indexOf(1)
      const lastIndex = this.visible.length - 1
      // stop scrolling after section 2
      if (this.visible[lastIndex] === 2) {
        visibleIndex = lastIndex
      }
      // free scroll
      if (visibleIndex === -1 || visibleIndex === 0) {
        return false
      }
      // pin orbit to section
      return this.nodeOffsets[visibleIndex] - this.sectionHeight * 0.12
    }

    get video() {
      return document.querySelector('video')
    }

    didMount() {
      setTimeout(() => {
        this.nodes = [
          document.querySelector('#home-header'),
          document.querySelector('#home-search'),
          document.querySelector('#home-profiles'),
        ]
        this.nodeOffsets = this.nodes.map(node => {
          return (
            document.documentElement.scrollTop + node.getBoundingClientRect().y
          )
        })
        const { offsetTop } = document.querySelector(
          '#home-profiles',
        ).parentNode
        this.orbitStopAfter = offsetTop
        this.updatePosition()
      })
    }

    onScroll = () => {
      this.update()
    }

    update = _.throttle(() => {
      this.updatePosition()
    }, 64)

    updatePosition = () => {
      this.wasVisible = this.visible
      this.scrollTop = document.documentElement.scrollTop
      this.visible = this.nodes.map(x => visiblePosition(x))
    }
  },
})
@view
export class HomeWrapper extends React.Component {
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  resume = null

  handleScroll = () => {
    this.props.homeStore.onScroll()
  }

  render({ homeStore, sectionHeight }) {
    return (
      <Media query={Constants.screen.tall}>
        {isTall => (
          <Media query={Constants.screen.large}>
            {isLarge => {
              const scrollTo = page => this.parallax.scrollTo(page)
              const sectionProps = {
                isTall,
                isLarge,
                homeStore,
                scrollTo,
                sectionHeight,
              }
              return (
                <>
                  <Parallax
                    ref={ref => (this.parallax = ref)}
                    scrollingElement={window}
                    container={document.documentElement}
                    pages={pages}
                    pageHeight={sectionHeight}
                    config={{ tension: 170, friction: 26 }}
                  >
                    <Video if={isLarge} />
                    <Header {...sectionProps} white />
                    <HomeHeader {...sectionProps} />
                    <SectionSearch {...sectionProps} />
                    <SectionProfiles {...sectionProps} />
                  </Parallax>
                  <SectionNoCloud {...sectionProps} />
                  <footer
                    css={{ position: 'relative', zIndex: 999, marginTop: 50 }}
                  >
                    <fade
                      css={{
                        position: 'absolute',
                        top: -500,
                        left: 0,
                        height: 500,
                        right: 0,
                        background: bodyBg,
                      }}
                    />
                    <Footer />
                  </footer>
                </>
              )
            }}
          </Media>
        )}
      </Media>
    )
  }
}

export const HomePage = () => (
  <UI.Theme
    theme={{
      background: bodyBg,
      color: bodyBg.darken(0.6).desaturate(0.5),
    }}
  >
    <WindowResize>
      {() => {
        const sectionHeight = Math.min(1250, Math.max(800, window.innerHeight))
        return <HomeWrapper sectionHeight={sectionHeight} />
      }}
    </WindowResize>
  </UI.Theme>
)
