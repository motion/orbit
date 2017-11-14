import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
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
    show = false
    pageNode = document.body.parentNode
    activeKey = null
    scrollPosition = 0

    willMount() {
      window.homeStore = this
      this.watchScroll()
      this.setTimeout(() => {
        this.ready = true
      }, 100)
    }

    watchScroll = () => {
      const { pageNode } = this
      const { scrollTop } = pageNode
      if (scrollTop !== this.scrollPosition) {
        if (blurredRef) {
          blurredRef.style.transform = `translateY(-${scrollTop}px)`
        }
        if (pageNode.scrollTop < 200) {
          this.activeKey = 0
        } else {
          this.activeKey = this.getActiveKey()
        }
        // hide ora in header
        if (pageNode.scrollTop > 600) {
          if (!this.show) {
            this.show = true
          }
        } else {
          if (this.show) {
            this.show = false
          }
        }
        this.scrollPosition = scrollTop
      }
      requestAnimationFrame(this.watchScroll)
    }

    getActiveKey() {
      const bottom = window.innerHeight + this.pageNode.scrollTop
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
    return (
      <page css={styles.page} ref={x => this.setRef(x)}>
        <Ora
          if={!blurred && homeStore.ready && !isSmall}
          css={{
            opacity: homeStore.show ? 1 : 0,
            pointerEvents: homeStore.show ? 'auto' : 'none',
            transition: 'opacity ease-in 400ms',
          }}
          homeStore={homeStore}
        />
        <contents css={{ overflow: 'hidden' }}>
          <HomeHeader />
          <HomeExamples {...sectionProps} />
          <HomeIntegrations {...sectionProps} />
          <HomeChat {...sectionProps} />
          <HomeSecurity {...sectionProps} />
          <HomeHandsFree if={false} {...sectionProps} />
          <UI.Theme name="dark">
            <footer>
              <View.Section space padded>
                <View.SectionContent>
                  <content $$row>
                    <column
                      css={{ height: 200, justifyContent: 'space-between' }}
                    >
                      <View.Title>Orbit</View.Title>
                      <View.Link>About us</View.Link>
                      <View.Link>Follow us</View.Link>
                      <View.Link>Press kit</View.Link>
                    </column>
                  </content>
                </View.SectionContent>
              </View.Section>
            </footer>
          </UI.Theme>
        </contents>
      </page>
    )
  }

  setRef(node) {
    if (this.node) {
      return
    }
    this.node = node
    if (!node) {
      return
    }
    if (this.props.blurred) {
      blurredRef = node.childNodes[0]
    }
  }

  getStyle() {
    if (!this.props.blurred) {
      return {
        page: {
          // height: window.innerHeight,
          // overflowY: 'scroll',
        },
      }
    }
    const topPad = 40
    const radius = Constants.ORA_BORDER_RADIUS / 2
    const height = Constants.ORA_HEIGHT
    const rightEdge = window.innerWidth / 2 + 475 - 20
    const bottom = height + topPad - radius
    const right = rightEdge - radius + 2
    const left = rightEdge - Constants.ORA_WIDTH + radius - 2
    return {
      page: {
        willChange: 'transform',
        background: '#fff',
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'opacity ease-in 400ms',
        opacity: this.props.homeStore.show ? 1 : 0,
        clip: `rect(${topPad + radius}px, ${right}px, ${bottom}px, ${left}px)`,
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
      },
    }
  }

  static style = {
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
