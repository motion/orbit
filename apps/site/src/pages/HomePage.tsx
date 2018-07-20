import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Header, Footer } from '../components'
import { SectionContent } from '../views/sectionContent'
import { Slant, Title, P, AppleLogo, HomeImg, WindowsLogo } from '../views'
import * as Constants from '../constants'
import Media from 'react-media'
import { scrollTo } from '../helpers'
import { Join } from '../components/Join'
import { Bauhaus } from '../views/bauhaus'
import { Parallax, ParallaxLayer } from '../components/Parallax'
import profileImg from '../../public/profileimg.jpg'
import { Icon } from '../views/icon'
import * as _ from 'lodash'
import homeImg from '../../public/orbit.jpg'
import searchImg from '../../public/orbit-search.jpg'
import avatarCardImg from '../../public/javi.png'
import { Page } from '../views/Page'
import { config } from 'react-spring'
import { throttle } from 'lodash'

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
    window.addEventListener('resize', this.handleResize)
    this.handleResizeFast()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
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
  <Title marginRight={100} italic size={4} alpha={1} color="#222" {...props} />
)

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
      <UI.Col
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

const WaveSVG = view(UI.View, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
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
})

WaveSVG.defaultProps = {
  tagName: 'svg',
}

const WaveBanner = forwardRef(({ forwardRef, fill = '#000', ...props }) => (
  <WaveSVG
    forwardRef={forwardRef}
    className="wavebanner"
    preserveAspectRatio="none"
    viewBox="0 0 3701 2273"
    width="100%"
    height="105%"
    {...props}
  >
    <path
      d="M0,55.59375 C212.979167,113.239583 555.390625,138.213542 1027.23438,130.515625 C1735,118.96875 2001.85938,27.1875 2637.45312,6.890625 C3061.18229,-6.640625 3415.69792,1.0625 3701,30 L3701,2197 C3532.39583,2141.58333 3222.74479,2116.04167 2772.04687,2120.375 C2096,2126.875 1777.21875,2273.0625 1131.75,2273.17188 C701.4375,2273.24479 324.1875,2247.85417 0,2197 L0,55.59375 Z"
      id="Rectangle"
      fill={fill}
    />
  </WaveSVG>
))

const ToolTip = ({ tooltip, tooltipProps = {}, ...props }) => (
  <UI.InlineFlex
    size={1.2}
    fontWeight={300}
    opacity={0.8}
    cursor="pointer"
    {...{
      '&:hover': {
        opacity: 1,
      },
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
    {isTall => <div css={{ height: isTall ? 25 : 20 }} />}
  </Media>
)

const SectionSubTitle = props => (
  <Title
    size={1.7}
    sizeLineHeight={1.1}
    titleFont
    alpha={0.65}
    fontWeight={400}
    {...props}
  />
)

const Pitch = ({ isLarge, scrollTo }) => (
  <>
    <Title italic size={4.4} fontWeight={300} alpha={1} color="#222">
      Instant-on Intranet
    </Title>
    <VertSpace />
    <SectionSubTitle>
      Unified team knowledge on your desktop. Organize and search everything in
      your cloud and behind your firewall.
    </SectionSubTitle>
    <VertSpace />
    <SectionSubTitle
      cursor="pointer"
      fontWeight={300}
      size={1.2}
      onClick={() => scrollTo(3)}
    >
      (Without giving up your privacy)
    </SectionSubTitle>
    <VertSpace />
    <VertSpace />
    <UI.Row>
      <Join />
      <UI.View flex={1} />
    </UI.Row>
    <VertSpace />
    <VertSpace />
    <UI.Row
      css={{
        margin: isLarge ? [0, 'auto', 0, 0] : [20, 0, 0, 0],
        alignItems: 'center',
      }}
    >
      <UI.Text alpha={0.5}>
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
    </UI.Row>
  </>
)

@view
class HomeHeader extends React.Component {
  render({ scrollTo, sectionHeight }) {
    return (
      <Page offset={0}>
        {({ Parallax, Content }) => (
          <>
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
            <div
              css={{
                height: sectionHeight,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                background:
                  'linear-gradient(-190deg, rgba(255,255,255,0.5), rgba(255,255,255,0))',
              }}
            />
            <Content id="home-header">
              <Slant {...firstSlant} {...topSlants} />
              <Slant inverseSlant {...secondSlant} {...topSlants} />
              <Slant {...thirdSlant} {...topSlants} />
              <Media
                query={Constants.screen.small}
                render={() => (
                  <>
                    <UI.View flex={1.2} />
                    <inner>
                      <Pitch scrollTo={scrollTo} />
                    </inner>
                    <UI.View flex={1} />
                  </>
                )}
              />
              <Media
                query={Constants.screen.large}
                render={() => (
                  <>
                    <UI.View
                      flex={1}
                      css={{
                        textAlign: 'left',
                        width: '40%',
                      }}
                    >
                      <UI.View flex={1.2} />
                      <Pitch isLarge scrollTo={scrollTo} />
                      <UI.View flex={1} />
                    </UI.View>
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

const IntIcon = view({
  margin: [0, 20, 0, 0],
  background: UI.color(waveColor)
    .darken(0.2)
    .alpha(0.1),
  borderRadius: 10,
  padding: 20,
})

@view
class SectionSearch extends React.Component {
  render() {
    const { isTall, isLarge, sectionHeight } = this.props
    const iconProps = {
      size: isLarge ? 55 : 50,
    }
    return (
      <Page offset={1}>
        {({ Parallax, Content }) => (
          <>
            <Parallax speed={0.1}>
              <WaveBanner fill={waveColor} />
            </Parallax>
            {/* <Parallax
              speed={-0.02}
              zIndex={2}
              effects={
                !Constants.isSafari && {
                  // seems opacity effect causes paints... shouldnt be bad test uncomment in fuutre
                  opacity: x => {
                    const fadeAfter = 1.2
                    if (x < fadeAfter) {
                      return x * Math.log(x * 10)
                    }
                    return fadeAfter * 2 - x
                  },
                }
              }
            >
              <SectionContentParallax>

              </SectionContentParallax>
            </Parallax> */}
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
            <Parallax speed={0.4} zIndex={1}>
              <Bauhaus
                showCircle
                warp={([x, y]) => [
                  x - 4 * -Math.sin(x / 30),
                  y - 4 * -Math.sin(x / 30),
                ]}
                css={{
                  transformOrigin: 'bottom left',
                  transform: { scale: 0.4, y: sectionHeight * 0.8, x: '-10%' },
                  opacity: 0.1,
                }}
              />
            </Parallax>
            <Content id="home-search">
              <Half css={{ flex: 1 }}>
                <UI.View flex={isLarge ? 1.5 : 3} />
                <SectionTitle
                  color={UI.color(waveColor)
                    .darken(0.6)
                    .desaturate(0.6)}
                >
                  Unified search that works
                </SectionTitle>
                <VertSpace />
                <SectionP>
                  The power of serverless NLP means your internal search is
                  actually internal.
                </SectionP>
                <VertSpace />
                <SectionSubP>
                  Search everything from cloud services like Slack and Google
                  Drive to internal APIs and databases without any setup.
                </SectionSubP>
                <VertSpace />
                <UI.View flex={0.5} />
                <UI.Row
                  css={{
                    transformOrigin: 'bottom left',
                    transform: {
                      scale: isTall ? 1.4 : 1,
                      z: 0,
                    },
                  }}
                >
                  <IntIcon>
                    <Icon name="slack" {...iconProps} />
                  </IntIcon>
                  <IntIcon>
                    <Icon name="gdocs" {...iconProps} />
                  </IntIcon>
                  <IntIcon>
                    <Icon name="gmail" {...iconProps} />
                  </IntIcon>
                  <IntIcon>
                    <Icon name="github" {...iconProps} />
                  </IntIcon>
                  <IntIcon>
                    <Icon name="gcalendar" {...iconProps} />
                  </IntIcon>
                  <IntIcon>
                    <Icon name="confluence" {...iconProps} />
                  </IntIcon>
                  <IntIcon>
                    <Icon name="jira" {...iconProps} />
                  </IntIcon>
                  <IntIcon>
                    <Icon name="dropbox" {...iconProps} />
                  </IntIcon>
                </UI.Row>
                <UI.View flex={1.5} />
              </Half>
            </Content>
          </>
        )}
      </Page>
    )
  }
}

@view
class SectionProfiles extends React.Component {
  render({ isLarge }) {
    return (
      <Page
        offset={2}
        childrenProps={{
          style: {
            zIndex: 4,
          },
        }}
      >
        {({ Parallax, Content }) => (
          <>
            <Parallax speed={0.1} zIndex={-1}>
              <Slant {...firstSlant} {...topSlants} />
              <Slant inverseSlant {...secondSlant} {...topSlants} />
              <Slant {...thirdSlant} {...topSlants} />
            </Parallax>
            <Content id="home-profiles" css={{ flex: 1 }}>
              <UI.View if={!isLarge} flex={1} />
              <div
                className="profiles"
                css={
                  isLarge
                    ? { width: '45%', margin: ['auto', 0] }
                    : { margin: ['auto', 0] }
                }
              >
                <SectionTitle size={2.8}>
                  The ultimate insight into your org
                </SectionTitle>
                <VertSpace />
                <SectionSubTitle>
                  See profiles of everyone in your company generated
                  automatically.
                </SectionSubTitle>
                <VertSpace />
                <SectionSubP if={false} color="#111" alpha={0.5}>
                  See recent collaborations, relevant activity, expert topics,
                  and more.
                </SectionSubP>
                <VertSpace />
                <VertSpace />
                <div css={{ position: 'relative' }}>
                  <UI.View
                    css={{
                      position: 'absolute',
                      bottom: '-10%',
                      left: '-10%',
                      right: '-20%',
                      height: '50%',
                      background: `linear-gradient(${bodyBg.alpha(
                        0,
                      )}, ${bodyBg} 70%)`,
                      zIndex: 100,
                      transform: {
                        z: 1000,
                      },
                    }}
                  />
                  <UI.Image
                    src={profileImg}
                    css={{
                      width: '40vw',
                      minWidth: 400,
                      maxWidth: 1100 / 2,
                      height: 'auto',
                      borderRadius: 10,
                      overflow: 'hidden',
                      boxShadow: '0 0 60px rgba(0,0,0,0.05)',
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
                </div>
              </div>
            </Content>
          </>
        )}
      </Page>
    )
  }
}

const Card = ({ title, children, icon }) => (
  <UI.View
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
    <div style={{ flex: 1 }}>
      <SectionP size={1.5} fontWeight={700} css={{ flex: 1 }}>
        {title}
      </SectionP>
      <SectionSubP size={1.7} sizeLineHeight={1} css={{ flex: 1 }}>
        {children}
      </SectionSubP>
    </div>
  </UI.View>
)

@view
class SectionNoCloud extends React.Component {
  render({ homeStore, isLarge }) {
    return (
      <UI.View
        css={{
          minHeight: homeStore.sectionHeight,
          padding: [100, 0],
          position: 'relative',
          zIndex: 1000,
        }}
      >
        <WaveBanner fill="#79bdd1" />
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
            style={{
              flexFlow: isLarge ? 'row' : 'column',
              justifyContent: isLarge ? 'space-around' : 'center',
              flex: 1,
            }}
          >
            <UI.Col css={isLarge && { width: '46%', margin: ['auto', 0] }}>
              <SectionTitle color="#fff">The Serverless Platform</SectionTitle>
              <VertSpace />
              <SectionSubTitle color="#fff" alpha={0.85}>
                Orbit runs entirely on your desktop with no server. It has a
                powerful plugin system to unify and display any type of
                knowledge.
              </SectionSubTitle>
              <VertSpace />
              <SectionSubP size={1.45} alpha={0.7} if={isLarge}>
                Because it has no server, it only takes a minute to install and
                we never touch a single bit of your private data. We don't like
                to call it decentralized, but you can think of it as a
                peer-to-peer intranet system for your team.
              </SectionSubP>
              <VertSpace />
              <VertSpace />
              <space if={false} css={{ margin: [0, 'auto'] }}>
                <SectionSubP size={3}>🙅‍ ☁️ = 🙅‍♂️ 😅</SectionSubP>
              </space>
            </UI.Col>
            <UI.Col css={isLarge && { width: '38%', margin: ['auto', 0] }}>
              <Card icon="lock" title="Complete Security">
                Your data never leaves your firewall.
              </Card>
              <Card icon="userrun" title="Instant Setup">
                Download to setup in just a couple minutes.
              </Card>
              <Card icon="business_plug" title="Custom apps">
                Build custom integrations right on your computer, and deploy to
                your teams with a click.
              </Card>
            </UI.Col>
          </div>
        </SectionContent>
      </UI.View>
    )
  }
}

const pages = 3

const imgProps = {
  position: 'absolute',
  top: 0,
  left: 0,
  transition: 'opacity ease-in 500ms',
}

class OrbitPure extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !_.isEqual(nextProps, this.props)
  }

  render() {
    const {
      scrollTop,
      restingPosition,
      lastLockedIndex,
      sectionHeight,
    } = this.props
    return (
      <ParallaxLayer
        ref={ref => (window.orbit = ref)}
        className="parallaxLayer"
        offset={0}
        speed={-1}
        scrollTop={scrollTop}
        css={{ zIndex: 1000 }}
      >
        <UI.Col
          css={{
            zIndex: 10,
            pointerEvents: 'none',
            position: 'absolute',
            right: 0,
            top: 0,
            width: '50%',
          }}
        >
          <UI.Col
            css={{
              pointerEvents: 'all',
              width: 1100 / 2,
              height: 2014 / 2,
              transformOrigin: 'top center',
              transform: {
                x: '5%',
                y: '10%',
                z: 0,
                scale:
                  sectionHeight < 1100
                    ? Math.min(
                        1,
                        Math.max(
                          0.75,
                          Math.log(1 / ((1300 - sectionHeight) / 1000)),
                        ) / 1.15,
                      )
                    : 1,
              },
            }}
          >
            <UI.TiltHoverGlow
              hideShadow
              restingPosition={restingPosition}
              tiltOptions={{ perspective: 1500 }}
              css={{
                borderRadius: 17,
                boxShadow: [[0, 23, 80, [0, 0, 0, 0.15]]],
                // WebkitMaskImage:
                //   '-webkit-linear-gradient(top, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
              }}
              glowProps={{
                opacity: 0.5,
              }}
            >
              <UI.View
                css={{
                  width: 1100 / 2,
                  height: 2014 / 2,
                  background: '#F3F3F3',
                  borderRadius: 17,
                }}
              />
              <HomeImg
                src={homeImg}
                debug
                css={{
                  ...imgProps,
                  zIndex: 3,
                  opacity: lastLockedIndex === 0 ? 1 : 0,
                }}
              />
              <HomeImg
                src={searchImg}
                css={{
                  ...imgProps,
                  zIndex: 2,
                  opacity: lastLockedIndex === 1 ? 1 : 0,
                }}
              />
              <HomeImg
                src={homeImg}
                css={{
                  ...imgProps,
                  zIndex: 1,
                  opacity: lastLockedIndex === 2 ? 1 : 0,
                }}
                borderProps={{
                  style: {
                    perspective: 2000,
                    zIndex: 1000,
                  },
                }}
              >
                <UI.Image
                  src={avatarCardImg}
                  css={{
                    width: 629 / 2,
                    height: 'auto',
                    position: 'absolute',
                    top: 618,
                    left: 5,
                    zIndex: 1000,
                    transition: 'all ease-in 400ms 300ms',
                    opacity: lastLockedIndex === 2 ? 1 : 0,
                    transform: `translate3d(0,0,${
                      lastLockedIndex === 2 ? 240 : 0
                    }px)`,
                  }}
                />
              </HomeImg>
            </UI.TiltHoverGlow>
          </UI.Col>
        </UI.Col>
      </ParallaxLayer>
    )
  }
}

class OrbitStore {
  get stopAt() {
    let { lockedIndex, locked, nodeOffsets } = this.props.homeStore
    const lastIndex = locked.length - 1
    // stop scrolling after section 2
    if (locked[lastIndex] === 2) {
      lockedIndex = lastIndex
    }
    // free scroll
    if (lockedIndex === -1 || lockedIndex === 0) {
      return false
    }
    // pin orbit to section
    return nodeOffsets[lockedIndex] - (lockedIndex === 2 ? 80 : 30)
  }
}

@view.attach('homeStore')
@view.attach({
  orbitStore: OrbitStore,
})
@view
class Orbit extends React.Component {
  render({ homeStore, orbitStore }) {
    const { stopAt } = orbitStore
    const { lockedIndex, lastLockedIndex } = homeStore
    const restingIndex = lockedIndex === -1 ? lastLockedIndex : lockedIndex
    const restingPosition = [[100, 100], [window.innerWidth, 100], [200, 700]][
      restingIndex
    ]
    const scrollTop = typeof stopAt !== 'number' ? false : stopAt
    const orbitProps = {
      scrollTop,
      restingPosition,
      lastLockedIndex,
      sectionHeight: homeStore.sectionHeight,
    }
    return <OrbitPure {...orbitProps} />
  }
}

setTimeout(() => {
  console.log('Orbit', Orbit)
})

const lockedPosition = (node, pct = 0.6) => {
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

const notNeg = x => (x < 0 ? 0 : x)

@view.provide({
  homeStore: class HomeStore {
    nodes = []
    nodeOffsets = []
    locked = []
    scrollTop = document.documentElement.scrollTop

    get sectionHeight() {
      return this.props.sectionHeight
    }

    orbitStopAfter = null

    get lastLockedIndex() {
      return (
        notNeg(_.lastIndexOf(this.locked, 1)) ||
        notNeg(_.lastIndexOf(this.locked, 2)) ||
        0
      )
    }

    get lockedIndex() {
      return this.locked.indexOf(1) || 0
    }

    get video() {
      return document.querySelector('video')
    }

    didMount() {
      window.Root = this
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
      this.scrollTop = document.documentElement.scrollTop
      this.locked = this.nodes.map(x => lockedPosition(x))
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

  handleScroll = throttle(() => {
    this.props.homeStore.onScroll()
  }, 16)

  render() {
    const { homeStore, sectionHeight } = this.props
    console.log('props', this.props)
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
                    config={config.slow} // { tension: 170, friction: 26 }
                  >
                    <Orbit if={isLarge} />
                    <Header {...sectionProps} white />
                    <HomeHeader {...sectionProps} />
                    <SectionSearch {...sectionProps} />
                    <SectionProfiles {...sectionProps} />
                  </Parallax>
                  <SectionNoCloud {...sectionProps} />
                  <UI.View
                    css={{ position: 'relative', zIndex: 999, marginTop: 50 }}
                  >
                    <UI.View
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
                  </UI.View>
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
