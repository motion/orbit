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
import peekImg from '~/../public/peek.png'

const topBg = Constants.colorMain // '#D6B190' //'#E1D1C8'
const bottomBg = Constants.colorMain.lighten(0.1).desaturate(0.1)

const WaveBanner = ({ fill = '#000', ...props }) => (
  <svg viewBox="0 0 3701 2273">
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
      margin: [0, -6],
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

@view
class Page extends React.Component {
  render({
    offset,
    peek,
    title,
    titleProps,
    children,
    background,
    orbit,
    backgroundProps,
    orbitProps,
  }) {
    return (
      <React.Fragment>
        <ParallaxLayer
          className="parallaxLayer background"
          $background
          if={background}
          offset={offset}
          speed={0.2}
          {...backgroundProps}
        >
          {background}
        </ParallaxLayer>
        <ParallaxLayer
          className="parallaxLayer orbit"
          $orbit
          if={orbit}
          offset={offset}
          speed={-0.85}
          {...orbitProps}
        >
          {orbit}
        </ParallaxLayer>
        <ParallaxLayer
          className="parallaxLayer peek"
          if={peek}
          offset={offset}
          speed={0.2}
        >
          {peek}
        </ParallaxLayer>
        <ParallaxLayer
          className="parallaxLayer title"
          $above
          if={title}
          offset={offset}
          speed={-0.05}
          {...titleProps}
        >
          <SectionContentParallax>{title}</SectionContentParallax>
        </ParallaxLayer>
        <ParallaxLayer
          $above
          if={children}
          className="parallaxLayer text header"
          offset={offset}
          speed={0.4}
        >
          {children}
        </ParallaxLayer>
      </React.Fragment>
    )
  }

  static style = {
    background: {
      zIndex: 0,
    },
    orbit: {
      zIndex: 1,
    },
    above: {
      zIndex: 2,
    },
  }
}

const borderize = bg => bg.darken(0.2).alpha(0.5)
const topSlants = {
  slantGradient: [topBg, borderize(bottomBg.mix(topBg)), topBg],
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

const VertSpace = view('div', {
  height: 20,
})

const Pitch = ({ isLarge }) => (
  <>
    <Title italic size={5.5} sizeLineHeight={1.1} alpha={1} color="#222">
      Instant-on Intranet
    </Title>
    <VertSpace />
    <P size={2.1} sizeLineHeight={1.1} titleFont alpha={0.65} fontWeight={400}>
      Unified cloud search for things and people. Installed in just a minute,
      with{' '}
      <ToolTip tooltip="Orbit runs privately on your device, never risking your data.">
        next&nbsp;level&nbsp;privacy
      </ToolTip>.
    </P>
    <VertSpace />
    <Join />
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
        css={{ cursor: 'pointer' }}
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
                opacity: 0.5,
                transform: { x: '-45%', y: '0%', scale: 0.65 },
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
                x - 4 * -Math.sin(x / 50),
                y - 4 * -Math.sin(x / 50),
              ]}
            />
            {/* <Bauhaus
              showTriangle
              css={{
                transform: { scale: 0.2, y: '91%', x: '-34%', rotate: '20deg' },
              }}
              warp={([x, y]) => [x, y - 4 * -Math.sin(x / 20)]}
            />
            <Bauhaus
              showSquare
              css={{
                transform: { scale: 0.1, y: '251%', x: '-184%' },
              }}
              warp={([x, y]) => [
                x * Math.sin(x / 200),
                y - 4 * -Math.sin(x / 20),
              ]}
            /> */}
          </>
        }
        orbit={
          <SectionContentParallax>
            <inner
              css={{
                position: 'absolute',
                right: 40,
                bottom: 0,
                top: 40,
                width: '50%',
              }}
            >
              <inner
                css={{
                  position: 'absolute',
                  right: 100,
                  left: 100,
                  top: 0,
                  bottom: 0,
                }}
              >
                <wrap
                  css={{
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
                      opacity: 0.6,
                    }}
                  >
                    <HomeImg />
                  </UI.TiltHoverGlow>
                </wrap>
              </inner>
            </inner>
          </SectionContentParallax>
        }
      >
        <SectionContentParallax>
          <Media
            query={Constants.screen.small}
            render={() => (
              <>
                <div $$flex />
                <Pitch />
                <div $$flex />
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
    sizeLineHeight={1.1}
    alpha={1}
    color="#222"
    {...props}
  />
)

const SectionP = props => (
  <P
    size={2.1}
    sizeLineHeight={1.1}
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
    titleFont
    color="#fff"
    alpha={0.8}
    {...props}
  />
)

@view
class SectionSearch extends React.Component {
  render() {
    return (
      <Page
        offset={1}
        background={
          <>
            <WaveBanner fill="#CECEF4" />
            <Bauhaus
              showTriangle
              css={{
                transform: { scale: 0.6, y: '-111%', x: '-80%' },
                opacity: 0.04,
              }}
            />
          </>
        }
        titleProps={{
          speed: -0.2,
          effects: {
            opacity: x => {
              const fadeAfter = 0.9
              if (x < fadeAfter) {
                return x * Math.log(x * 10)
              }
              return fadeAfter * 2 - x
            },
          },
        }}
        title={
          <inner css={{ width: '45%' }}>
            <SectionTitle>Unified search that works</SectionTitle>
            <VertSpace />
            <SectionP>
              Orbit runs completely behind your firewall. With many integrations
              and <ToolTip>novel NLP</ToolTip> it searches everything, fast.
            </SectionP>
            <VertSpace />
            <SectionSubP>
              Make your intranet wiki, private databases, and internal APIs
              searchable by everyone in your company.
            </SectionSubP>
          </inner>
        }
      />
    )
  }
}

@view
class SectionProfiles extends React.Component {
  render() {
    return (
      <Page offset={2}>
        <img
          src={peekImg}
          css={{
            position: 'absolute',
            top: -600,
            left: '20%',
            width: 1319 / 2,
            height: 'auto',
            zIndex: 100,
            transform:
              'perspective(1000px) rotateY(5deg) rotateX(10deg) scale(0.95)',
          }}
        />
      </Page>
    )
  }
}

@view
class SectionIntegrations extends React.Component {
  render() {
    return (
      <Page
        offset={3}
        titleProps={{
          speed: -0.2,
        }}
        title={
          <inner css={{ width: '50%', marginTop: '-10%' }}>
            <Title
              italic
              size={4.2}
              sizeLineHeight={1.1}
              alpha={1}
              color="#222"
            >
              Fourth section
            </Title>
            <P
              size={2.1}
              sizeLineHeight={1.1}
              titleFont
              alpha={0.65}
              fontWeight={400}
            >
              Running private to your device means you can integrate everything
              in one. Search databases, internal APIs, and internal wikis with
              ease.
            </P>
          </inner>
        }
      />
    )
  }
}

const pages = 5

@view
export class HomePage extends React.Component {
  parallax = null

  componentDidMount() {
    const dispose = this.handleScroll()
    this.subscriptions.add({ dispose })
  }

  handleScroll = () => {
    let frameID
    const render = () => {
      const offset = document.documentElement.scrollTop
      const cur = offset + window.innerHeight
      const page = cur / window.innerHeight - 1
      this.parallax.scrollTo(page)
      frameID = requestAnimationFrame(render)
    }
    render()
    return () => cancelAnimationFrame(frameID)
  }

  render() {
    return (
      <Parallax
        scrolling={false}
        ref={node => (this.parallax = node)}
        pages={pages}
      >
        <UI.Theme
          theme={{
            background: topBg,
            color: topBg.darken(0.6).desaturate(0.5),
          }}
        >
          <Media query={Constants.screen.large}>
            {isLarge => (
              <Media query={Constants.screen.medium}>
                {isMedium => (
                  <>
                    <Header white />
                    <HomeHeader isLarge={isLarge} isMedium={isMedium} />
                    <SectionSearch isLarge={isLarge} isMedium={isMedium} />
                    <SectionProfiles />
                    <SectionIntegrations />
                    <Page offset={4}>
                      <Footer />
                    </Page>
                  </>
                )}
              </Media>
            )}
          </Media>
        </UI.Theme>
      </Parallax>
    )
  }
}
