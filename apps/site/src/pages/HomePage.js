import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Header, Footer } from '~/components'
import SectionContent from '~/views/sectionContent'
import Router from '~/router'
import { Slant, Title, P, AppleLogo, HomeImg, WindowsLogo, Glow } from '~/views'
import * as Constants from '~/constants'
import Media from 'react-media'
import { scrollTo } from '~/helpers'
import bg from '~/../public/girl.svg'
import { Bauhaus } from '~/views/bauhaus'
import { Parallax, ParallaxLayer } from '~/components/Parallax'
import profileImg from '~/../public/profileimg.png'
import { Icon } from '~/views/icon'

const bodyBg = Constants.colorMain
const bottomBg = Constants.colorMain.lighten(0.1).desaturate(0.1)

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

const WaveBanner = ({ fill = '#000', ...props }) => (
  <svg
    className="wavebanner"
    preserveAspectRatio="none"
    viewBox="0 0 3701 2273"
    width="100%"
    height="100%"
    css={{
      transform: {
        scaleY: 0.98,
        y: '-2%',
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
)

const ToolTip = ({ tooltip, tooltipProps, ...props }) => (
  <UI.Surface
    inline
    background="transparent"
    tooltip={
      <UI.Text size={1.2} {...tooltipProps}>
        {tooltip}
      </UI.Text>
    }
    css={{
      margin: [0, -5],
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

class NormalLayer extends React.Component {
  state = {
    height: window.innerHeight,
  }

  resize = () => {
    this.setState({ height: window.innerHeight })
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize, false)
    this.resize()
  }

  componentWillUnmount() {
    window.addEventListener('resize', this.resize, false)
  }

  render() {
    return <layer css={{ height: this.state.height }} {...this.props} />
  }
}

const layers = {
  slower: { speed: -0.2 },
  slow: { speed: -0.1 },
  fast: { speed: 0.1 },
  faster: { speed: 0.2 },
}

@view
class Page extends React.Component {
  render({
    offset,
    title,
    titleProps,
    children,
    childrenProps,
    background,
    orbit,
    backgroundProps,
    orbitProps,
    banner,
    zIndex = 0,
  }) {
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
          className="parallaxLayer orbit"
          if={orbit}
          offset={offset}
          speed={-0.8}
          css={{
            zIndex: 4 + zIndex,
          }}
          {...orbitProps}
        >
          {orbit}
        </ParallaxLayer>
        <ParallaxLayer
          className="parallaxLayer title"
          css={{
            zIndex: 2 + zIndex,
          }}
          if={title}
          offset={offset}
          speed={-0.05}
          {...titleProps}
        >
          <SectionContentParallax>{title}</SectionContentParallax>
        </ParallaxLayer>
        <NormalLayer
          css={{ position: 'relative', zIndex: 1 + zIndex }}
          {...childrenProps}
        >
          {children}
        </NormalLayer>
      </React.Fragment>
    )
  }
}

const borderize = bg => bg.darken(0.2).alpha(0.5)
const topSlants = {
  slantGradient: [bodyBg, borderize(bottomBg.mix(bodyBg)), bodyBg],
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

import { Join } from '~/components/Join'

const VertSpace = () => (
  <Media query={Constants.screen.tall}>
    {isTall => <div css={{ height: isTall ? 20 : 10 }} />}
  </Media>
)

const SectionSubTitle = props => (
  <P size={2} titleFont alpha={0.65} fontWeight={400} {...props} />
)

const Pitch = ({ isLarge }) => (
  <>
    <Title italic size={5.2} alpha={1} color="#222">
      Instant-on Intranet
    </Title>
    <VertSpace />
    <SectionSubTitle>
      Unified cloud search for things and people. Installed in just a minute,
      with{' '}
      <ToolTip tooltip="Orbit runs privately on your device, never risking your data.">
        complete&nbsp;privacy
      </ToolTip>.
    </SectionSubTitle>
    <VertSpace />
    <row $$row>
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
  render() {
    return (
      <Page
        offset={0}
        background={
          <>
            <Slant {...firstSlant} {...topSlants} />
            <Slant inverseSlant {...secondSlant} {...topSlants} />
            <Slant {...thirdSlant} {...topSlants} />
            <Glow
              style={{
                background: '#fff',
                opacity: 1,
                transform: { x: '-65%', y: '-20%', scale: 0.65 },
              }}
            />
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
          </>
        }
        orbit={
          <Media
            query={Constants.screen.large}
            render={() => (
              <SectionContentParallax>
                <inner
                  css={{
                    pointerEvents: 'none',
                    position: 'absolute',
                    right: -50,
                    bottom: 0,
                    top: 0,
                    width: '50%',
                  }}
                >
                  <wrap
                    css={{
                      pointerEvents: 'all',
                      width: 1101 / 2,
                      height: 2016 / 2,
                      transform: {
                        x: 20,
                        y: '20%',
                      },
                    }}
                  >
                    <UI.TiltHoverGlow
                      restingPosition={[100, 100]}
                      tiltOptions={{ perspective: 2000 }}
                      glowProps={{
                        opacity: 0.5,
                      }}
                    >
                      <HomeImg />
                    </UI.TiltHoverGlow>
                  </wrap>
                </inner>
              </SectionContentParallax>
            )}
          />
        }
      >
        <SectionContentParallax>
          <Media
            query={Constants.screen.small}
            render={() => (
              <>
                <div $$flex />
                <Pitch />
                <div $$flex={2.5} />
                <orbit
                  css={{
                    zIndex: -1,
                    position: 'absolute',
                    bottom: '-10%',
                    margin: [0, 'auto'],
                    transformOrigin: 'bottom center',
                    transform: { scale: 0.5 },
                  }}
                >
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
                  <Pitch isLarge />
                  <div $$flex />
                </inner>
              </>
            )}
          />
        </SectionContentParallax>
      </Page>
    )
  }

  static style = {
    paintingWrap: {
      background: '#000',
      left: '50.2%',
      right: '-10%',
      top: '-15%',
      bottom: '-15%',
      overflow: 'hidden',
      transform: {
        rotate: '4.3deg',
      },
    },
    painting: {
      opacity: 0.3,
      background: `url(${bg}) no-repeat top left`,
      backgroundSize: 'cover',
      bottom: '-10%',
      transform: {
        rotate: '-4.3deg',
        x: '-5%',
        y: '-10%',
      },
    },
    spacer: {
      pointerEvents: 'none',
    },
    mainSection: {
      position: 'relative',
      zIndex: 10,
      // background: '#fff',
    },
    smallCallout: {
      padding: [0, 0, 40, 0],
    },
    largeCallout: {
      position: 'absolute',
      top: 0,
      left: '55%',
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      // border: [1, [0, 0, 0, 0.04]],
      // padding: [60, 40],
      // margin: [-60, -40],
    },
    borderLine: {
      margin: [40, 40, 20, 0],
      width: '65%',
      height: 1,
      background: [0, 0, 0, 0.05],
    },
    smallInstallBtn: {
      // transform: {
      //   scale: 1.2,
      // },
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
      left: '50%',
      pointerEvents: 'none',
    },
  }
}

const Monitor = props => (
  <svg viewBox="0 0 1708 1119" {...props}>
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="Group" fill="#818181">
        <rect
          id="Rectangle"
          x="0.121018695"
          y="0.041015625"
          width="1707.75796"
          height="1081.91797"
          rx="15"
        />
        <polygon
          id="Rectangle-2"
          points="654.5 1078.95898 1053.5 1078.95898 1073.5 1115.95898 634.5 1115.95898"
        />
      </g>
    </g>
  </svg>
)

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
    size={1.8}
    sizeLineHeight={1.1}
    fontWeight={300}
    titleFont
    color="#fff"
    alpha={0.9}
    {...props}
  />
)

const waveColor = '#C4C4F4'

@view
class SectionSearch extends React.Component {
  render({ isLarge }) {
    const iconProps = {
      size: isLarge ? 55 : 40,
    }
    return (
      <Page
        offset={1}
        banner={waveColor}
        background={
          <>
            <Bauhaus
              showTriangle
              css={{
                transform: { scale: 0.6, y: '-111%', x: '-80%' },
                opacity: 0.1,
              }}
            />
          </>
        }
        titleProps={{
          effects: {
            opacity: x => {
              const fadeAfter = 1
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
              The power of on-device{' '}
              <ToolTip tooltip="Orbit uses novel on-device machine learning to power conceptural, summarized search.">
                NLP
              </ToolTip>{' '}
              for powerful cloud and private search with nothing leaving your
              firewall.
            </SectionP>
            <VertSpace />
            <SectionSubP>
              From services like Slack and Google Docs to internal folders,
              wikis, databases, and APIs.
            </SectionSubP>
            <VertSpace />
            <VertSpace />
            <div css={{ height: 200 }} />
          </Half>
        }
      >
        <SectionContent css={{ flex: 1 }}>
          <div $$flex={3} />
          <Half>
            <icons>
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
        </SectionContent>
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
            <Bauhaus showSquare css={{ opacity: 1 }} />
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
        <SectionContent css={{ flex: 1 }}>
          <inner css={isLarge && { width: '45%', margin: [100, 0, 0] }}>
            <SectionTitleSmall>Operate personally</SectionTitleSmall>
            <VertSpace />
            <SectionSubTitle>
              Beautiful automatic profile cards keep you up to date with
              teammates and reduce constant interruption.
            </SectionSubTitle>
            <VertSpace />
            <VertSpace />
          </inner>
          <img
            src={profileImg}
            css={{
              width: 1283 / 2,
              height: 'auto',
              transform: {
                y: 0,
                x: 60,
                perspective: 1000,
                rotateY: '3deg',
                rotateX: '4deg',
                rotateZ: '-1deg',
              },
            }}
          />
        </SectionContent>
      </Page>
    )
  }
}

const Card = ({ title, children, icon }) => (
  <card
    css={{
      flexFlow: 'row',
      padding: 30,
      background: [255, 255, 255, 0.05],
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
      <SectionP css={{ flex: 1 }}>{title}</SectionP>
      <SectionSubP css={{ flex: 1 }}>{children}</SectionSubP>
    </content>
  </card>
)

@view
class SectionIntegrations extends React.Component {
  render({ isLarge }) {
    return (
      <Page
        offset={3}
        zIndex={5}
        banner="#AE2E73"
        title={
          <Bauhaus
            showCircle
            css={{ opacity: 0.1, transform: { y: '50%', x: '-80%' } }}
          />
        }
      >
        <SectionContent css={{ flex: 1 }}>
          <div
            css={{
              flexFlow: isLarge ? 'row' : 'column',
              justifyContent: isLarge ? 'space-around' : 'center',
              flex: 1,
            }}
          >
            <inner css={isLarge && { width: '42%', margin: ['auto', 0] }}>
              <SectionTitle color="#fff">The No-Cloud Advantage</SectionTitle>
              <VertSpace />
              <SectionSubTitle color="#fff">
                We've rethought the intranet from the ground up. It starts by
                putting users and privacy first.
              </SectionSubTitle>
              {/* <Bauhaus showCircle showTriangle showSquare /> */}
              <VertSpace />
              <VertSpace />
            </inner>
            <inner css={isLarge && { width: '45%', margin: ['auto', 0] }}>
              <Card icon="fire" title="Secure">
                Your data never leaves your firewall.
              </Card>
              <Card icon="time" title="Easy">
                From download to setup in just a couple of minutes.
              </Card>
              <Card icon="sport_user-run" title="Useful">
                Instant cloud search is now right in your OS, always at hand.
              </Card>
            </inner>
          </div>
        </SectionContent>
      </Page>
    )
  }
}

const pages = 5

@view
export class HomePage extends React.Component {
  render() {
    return (
      <Parallax
        scrollingElement={window}
        container={document.documentElement}
        pages={pages}
        config={{ tension: 170, friction: 26 }}
      >
        <UI.Theme
          theme={{
            background: bodyBg,
            color: bodyBg.darken(0.6).desaturate(0.5),
          }}
        >
          <Media query={Constants.screen.large}>
            {isLarge => (
              <>
                <Header scrollTo={page => this.parallax.scrollTo(page)} white />
                <HomeHeader isLarge={isLarge} />
                <SectionSearch isLarge={isLarge} />
                <SectionProfiles isLarge={isLarge} />
                <SectionIntegrations isLarge={isLarge} />
                <Page offset={4} zIndex={3}>
                  <hideOrbit
                    css={{
                      background: `linear-gradient(transparent, ${bodyBg} 20%)`,
                      height: 800,
                      position: 'absolute',
                      top: -800,
                      left: 0,
                      right: 0,
                      zIndex: -1,
                    }}
                  />
                  <Footer />
                </Page>
              </>
            )}
          </Media>
        </UI.Theme>
      </Parallax>
    )
  }
}
