import * as React from 'react'
import { view } from '@mcro/black'
import * as View from '~/views'
import * as Constants from '~/constants'
import Ora from './home/ora'
import HomeHeader from './home/header'
import HomeHandsFree from './home/sectionHandsFree'
import HomeSecurity from './home/sectionSecurity'
import HomeChat from './home/sectionChat'
import HomeExamples from './home/sectionExamples'
import HomeIntegrations from './home/sectionIntegrations'

let blurredRef

@view.provide({
  homeStore: class HomeStore {
    bounds = {}
    ready = false
    isSticky = false
    pageNode = null
    activeKey = 0
    scrollPosition = 0

    willMount() {
      window.homeStore = this
      this.setTimeout(() => {
        this.ready = true
      }, 100)
    }

    willUnmount() {
      this.unmounted = true
    }

    setBlurredRef = ref => {
      if (!ref) return
      blurredRef = ref
    }

    setPageRef = ref => {
      if (!ref) return
      this.pageNode = ref
      this.watchScroll()
    }

    watchScroll = () => {
      const { pageNode } = this
      if (!pageNode) {
        return
      }
      const { scrollTop: y } = pageNode
      if (y !== this.scrollPosition) {
        const { isSticky } = this
        // hide ora in header
        if (y > Constants.ORA_TOP - Constants.ORA_TOP_PAD) {
          if (!isSticky) {
            this.isSticky = true
          }
          const key = this.getActiveKey(y)
          if (key !== this.activeKey) {
            this.activeKey = key
          }
        } else {
          if (isSticky) {
            this.isSticky = false
            this.activeKey = 0
          }
        }
        if (blurredRef) {
          blurredRef.style.transform = `translateY(-${y}px)`
          if (!this.isSticky) {
            blurredRef.parentNode.style.clip = this.getClipBox(-y, 0, -y)
          } else {
            if (isSticky !== this.isSticky) {
              blurredRef.parentNode.style.clip = this.getClipBox()
            }
          }
        }
        this.scrollPosition = y
      }
      if (!this.unmounted) {
        requestAnimationFrame(this.watchScroll)
      }
    }

    getActiveKey(scrollTop) {
      const bottom = window.innerHeight + scrollTop
      for (const key of Object.keys(this.bounds).reverse()) {
        const bound = this.bounds[key]
        if (!bound) {
          continue
        }
        const extraDistance = window.innerHeight / (100 / bound.percentFromTop)
        if (bound.top + extraDistance < bottom) {
          return key
        }
      }
      return 0
    }

    get activeBounds() {
      return this.bounds[this.activeKey]
    }

    setSection = (key, options = { percentFromTop: 50 }) => {
      return node => {
        if (node) {
          const { top, bottom } = node.getBoundingClientRect()
          this.bounds = {
            ...this.bounds,
            [key]: {
              ...options,
              top,
              bottom,
            },
          }
        }
      }
    }

    getClipBox = (t = 0, r = 0, b = 0, l = 0) => {
      const { isSticky } = this
      const radiusAdjust = 1.5
      const topPad = isSticky ? Constants.ORA_TOP_PAD : Constants.ORA_TOP
      const radius = Constants.ORA_BORDER_RADIUS / 2
      const height = Constants.ORA_HEIGHT
      const rightEdge = window.innerWidth / 2 + Constants.ORA_LEFT_PAD + 150
      const bottom = height + topPad - radius / radiusAdjust
      const right = rightEdge - radius + 2
      const left = rightEdge - Constants.ORA_WIDTH + radius - 2
      return `rect(${topPad + radius / radiusAdjust + t}px, ${right +
        r}px, ${bottom + b}px, ${left + l}px)`
    }
  },
})
@view
export default class HomePage extends React.Component {
  render({ homeStore, blurred, isSmall }) {
    const styles = this.getStyle()
    const sectionProps = {
      isSmall,
      blurred,
      homeStore,
      setSection: homeStore.setSection,
    }

    const sinWidth = 200

    const homeContents = [
      <HomeExamples {...sectionProps} />,
      //<HomeIntegrations if={false} {...sectionProps} />,
      <HomeChat {...sectionProps} />,
      <HomeSecurity {...sectionProps} />,
      <HomeHandsFree {...sectionProps} />,
      <View.Footer />,
    ].map((x, index) => React.cloneElement(x, { key: index }))

    return (
      <page css={styles.page} ref={!blurred && homeStore.setPageRef}>
        <View.Sine
          if={!blurred}
          color={Constants.dark1}
          strokeWidth={2}
          amplitude={sinWidth / 2}
          freq={0.0055}
          phase={0}
          css={{
            opacity: 0.3,
            pointerEvents: 'none',
            height: sinWidth,
            marginLeft: sinWidth / 2,
            position: 'absolute',
            zIndex: 2,
            top: 0,
            left: '50%',
            width: Constants.SECTION_HEIGHT * 3 + 200,
            transformOrigin: 'top left',
            transform: {
              rotate: '90deg',
              scale: 1,
            },
          }}
        />
        <View.Sine
          if={!blurred}
          color={Constants.dark2}
          strokeWidth={2}
          amplitude={sinWidth / 2}
          freq={0.0055}
          css={{
            opacity: 0.3,
            pointerEvents: 'none',
            height: sinWidth,
            marginLeft: sinWidth / 2,
            position: 'absolute',
            zIndex: 2,
            top: 0,
            left: '50%',
            width: Constants.SECTION_HEIGHT * 3 + 200,
            transformOrigin: 'top left',
            transform: {
              rotate: '90deg',
              scale: 1,
            },
          }}
        />
        <HomeHeader if={!blurred} />
        <Ora
          if={!blurred && homeStore.ready && !isSmall}
          homeStore={homeStore}
        />
        {!blurred && homeContents}
        <contents if={blurred} ref={homeStore.setBlurredRef}>
          <HomeHeader />
          {homeContents}
        </contents>
        <centerline
          if={false}
          css={{
            position: [0, 'auto', 0, '50%'],
            width: 1,
            background: 'red',
            zIndex: 10000,
          }}
        />
      </page>
    )
  }

  getStyle() {
    if (!this.props.blurred) {
      return {
        page: {},
      }
    }
    return {
      page: {
        background: '#fff',
        willChange: 'clip',
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        clip: this.props.homeStore.getClipBox(),
      },
    }
  }

  static theme = ({ blurred }) => {
    if (!blurred) {
      return {}
    }
    return {
      contents: {
        filter: 'blur(20px)',
        overflow: 'hidden',
        willChange: 'transform',
        transform: { y: 0 },
      },
    }
  }

  static style = {
    page: {
      height: '100%',
      overflowX: 'hidden',
      overflowY: 'scroll',
      position: 'relative',
      // dont do this causes tons of paints:
      // transform: { z: 0 },
    },
    contents: {},
    '@keyframes orbital0': {
      from: {
        transform: 'rotate(0deg) translateX(150px) rotate(0deg)',
      },
      to: {
        transform: 'rotate(360deg) translateX(150px) rotate(-360deg)',
      },
    },
    '@keyframes orbital1': {
      from: {
        transform: 'rotate(0deg) translateX(300px) rotate(0deg)',
      },
      to: {
        transform: 'rotate(360deg) translateX(300px) rotate(-360deg)',
      },
    },
    '@keyframes orbital2': {
      from: {
        transform: 'rotate(0deg) translateX(450px) rotate(0deg)',
      },
      to: {
        transform: 'rotate(360deg) translateX(450px) rotate(-360deg)',
      },
    },
  }
}
