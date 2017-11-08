import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as View from '~/views'
import * as Constants from '~/constants'
import { throttle } from 'lodash'
import Ora from './home/ora'
import HomeHeader from './home/header'
import HomeHandsFree from './home/sectionHandsFree'
import HomeSecurity from './home/sectionSecurity'
import HomeChat from './home/sectionChat'
import HomeExamples from './home/sectionExamples'

let blurredRef

@view.provide({
  homeStore: class HomeStore {
    bounds = {}
    ready = false
    pageNode = null
    activeKey = null

    willMount() {
      this.watch(() => {
        if (this.pageNode) {
          this.on(
            this.pageNode,
            'scroll',
            throttle(() => {
              if (this.pageNode.scrollTop < 200) {
                this.activeKey = 0
              } else {
                this.activeKey = this.getActiveKey()
              }
            }, 100)
          )
        }
      })
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
  componentDidMount() {
    this.props.homeStore.ready = true
  }

  render({ homeStore, blurred, isSmall }) {
    const styles = this.getStyle()
    const sectionProps = {
      ...this.props,
      setSection: homeStore.setSection,
    }
    return (
      <page css={styles.page} ref={x => this.setRef(x)}>
        <Ora
          if={!blurred && homeStore.ready && !isSmall}
          homeStore={homeStore}
        />
        <contents css={{ overflow: 'hidden' }}>
          <HomeHeader />
          <HomeExamples {...sectionProps} />
          <HomeChat {...sectionProps} />
          <HomeHandsFree {...sectionProps} />
          <HomeSecurity {...sectionProps} />
          <footer>
            <View.Section css={{ padding: [250, 0] }} $$centered padded>
              <View.SectionContent>
                <View.Text size={3}>
                  Orbit is going into private beta in December.
                </View.Text>
                <View.Text size={2}>
                  <View.Link href="mailto:natewienert@gmail.com">
                    Send us an email
                  </View.Link>{' '}
                  if you're interested.
                </View.Text>
              </View.SectionContent>
            </View.Section>
          </footer>
        </contents>
      </page>
    )
  }

  setRef(node) {
    this.node = node
    this.props.homeStore.pageNode = node
    if (!node) {
      return
    }
    if (this.props.blurred) {
      blurredRef = node.childNodes[0]
    } else {
      this.on(
        this.node,
        'scroll',
        throttle(() => {
          blurredRef.style.transform = `translateY(-${this.node.scrollTop}px)`
        }, 16)
      )
    }
  }

  getStyle() {
    if (!this.props.blurred) {
      return {
        page: {
          height: window.innerHeight,
          overflowY: 'scroll',
        },
      }
    }
    const pad = 20
    const height = Constants.ORA_HEIGHT
    const rightEdge = window.innerWidth / 2 + 475 - pad
    const bottom = height + pad
    const right = rightEdge - Constants.ORA_BORDER_RADIUS + 2
    const left =
      rightEdge - Constants.ORA_WIDTH + Constants.ORA_BORDER_RADIUS - 2
    return {
      page: {
        background: '#fff',
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        // rounded:
        // polygon(5% 0, 95% 0, 100% 4%, 100% 95%, 95% 100%, 5% 100%, 0 95%, 0 5%)
        clip: `rect(${pad + 1}px, ${right}px, ${bottom}px, ${left}px)`,
        // clipPath: `url(/ora.svg#clip)`,
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
    contents: {
      transform: {
        z: 0,
      },
    },
  }
}
