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
import * as _ from 'lodash'

const topBg = Constants.colorMain // '#D6B190' //'#E1D1C8'
const bottomBg = Constants.colorMain.lighten(0.1).desaturate(0.1)

const SectionContentParallax = props => (
  <SectionContent css={{ height: '100%' }} {...props} />
)

const scrollToTrack = (to, track) => {
  return () => {
    window.ga('send', 'event', 'Home', 'download', track)
    scrollTo(to)()
  }
}

const Page = ({
  offset,
  peek,
  title,
  titleProps,
  children,
  background,
  orbit,
}) => (
  <React.Fragment>
    <ParallaxLayer
      className="parallaxLayer background"
      if={background}
      offset={offset}
      speed={1}
    >
      {background}
    </ParallaxLayer>
    <ParallaxLayer
      className="parallaxLayer orbit"
      if={orbit}
      offset={offset}
      speed={-0.85}
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
      if={title}
      offset={offset}
      speed={-0.05}
      effects={
        {
          // opacity: val
        }
      }
      {...titleProps}
    >
      <SectionContentParallax>{title}</SectionContentParallax>
    </ParallaxLayer>
    <ParallaxLayer
      if={children}
      className="parallaxLayer text header"
      offset={offset}
      speed={0.4}
    >
      {children}
    </ParallaxLayer>
  </React.Fragment>
)

const borderize = bg => bg.darken(0.2).alpha(0.5)
const topSlants = {
  slantGradient: [topBg, borderize(bottomBg.mix(topBg))],
}
const bottomSlants = {
  slantGradient: [borderize(bottomBg.mix(topBg)), topBg],
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

class HomeStore {
  stars = null

  didMount() {
    // this.on(
    //   window,
    //   'scroll',
    //   throttle(() => {
    //     const max = window.innerHeight * 3
    //     // 0 - 1 of how far down we are
    //     const pctDown =
    //       (max - (max - document.scrollingElement.scrollTop)) / max
    //     const offset = pctDown * 30
    //     // this.stars.stopAnimation()
    //     this.stars(Spring, {
    //       to: { y: -offset },
    //     })
    //   }, 100),
    // )
    // setTimeout(() => {
    //   this.stars(Spring, {
    //     to: { y: 0 },
    //   })
    // })
  }
}

const Pitch = ({ isLarge }) => (
  <>
    <Title italic size={6.2} sizeLineHeight={1.1} alpha={1} color="#222">
      Orderly Conduct
    </Title>
    <P size={2.1} sizeLineHeight={1.1} titleFont alpha={0.65} fontWeight={400}>
      Unified cloud search and profiles installed in just a minute with{' '}
      <UI.Surface
        inline
        background="transparent"
        tooltip="Orbit never sends any data to the cloud. It runs entirely privately on your device. That's peace of mind for keeping minds in sync."
      >
        complete&nbsp;privacy
      </UI.Surface>.
    </P>
    <actions
      $$row
      css={{
        margin: isLarge ? [25, 'auto', 0, 0] : [20, 0, 0, 0],
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

@view({
  store: HomeStore,
})
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
              hideTriangle
              hideSquare
              circleColor="#F7C7FF"
              css={{ transform: { scale: 0.97, y: '-11%', x: '54%' } }}
              warp={([x, y]) => [x, y - 4 * -Math.sin(x / 50)]}
            />
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
                    width: 1100 / 2,
                    height: 2016 / 2,
                    transform: {
                      x: 20,
                      y: 100,
                    },
                  }}
                >
                  <UI.TiltHoverGlow
                    restingPosition={[100, 100]}
                    tiltOptions={{ perspective: 2000 }}
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

@view
class SectionSearch extends React.Component {
  render() {
    return (
      <Page
        offset={1}
        title={
          <inner css={{ width: '50%' }}>
            <Title
              italic
              size={4.2}
              sizeLineHeight={1.1}
              alpha={1}
              color="#222"
            >
              Search that works
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

@view
class SectionProfiles extends React.Component {
  render() {
    return (
      <Page
        offset={2}
        title={
          <inner css={{ width: '50%' }}>
            <Title
              italic
              size={4.2}
              sizeLineHeight={1.1}
              alpha={1}
              color="#222"
            >
              Search that works
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

@view
class SectionIntegrations extends React.Component {
  render() {
    return (
      <Page
        offset={3}
        title={
          <inner css={{ width: '50%' }}>
            <Title
              italic
              size={4.2}
              sizeLineHeight={1.1}
              alpha={1}
              color="#222"
            >
              Search that works
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

@view
export class HomePage extends React.Component {
  parallax = null

  componentDidMount() {
    this.on(window, 'scroll', _.throttle(this.handleScroll, 32))
  }

  handleScroll = () => {
    const offset = window.scrollTop
    console.log('offset', offset)
  }

  render() {
    return (
      <Parallax ref={node => (this.parallax = node)} pages={5}>
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
                  <home $$flex $$background={topBg}>
                    <Header white />
                    <HomeHeader isLarge={isLarge} isMedium={isMedium} />
                    <SectionSearch isLarge={isLarge} isMedium={isMedium} />
                    <SectionProfiles />
                    <SectionIntegrations />
                    <Page offset={4}>
                      <Footer />
                    </Page>
                  </home>
                )}
              </Media>
            )}
          </Media>
        </UI.Theme>
      </Parallax>
    )
  }
}
