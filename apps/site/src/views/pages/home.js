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

let blurredRef

@view
export default class HomePage extends React.Component {
  bounds = []
  state = {
    ready: false,
  }

  componentDidMount() {
    this.setState({ ready: true })
  }

  setRef(node) {
    this.node = node
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

  setSection = index => {
    return node => {
      if (node) {
        this.bounds[index] = node.getBoundingClientRect()
      }
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
    const bottom = height + pad
    const right = window.innerWidth - pad - Constants.ORA_BORDER_RADIUS + 2
    const left =
      window.innerWidth -
      Constants.ORA_WIDTH -
      pad +
      Constants.ORA_BORDER_RADIUS -
      2
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
        clip: `rect(${pad}px, ${right}px, ${bottom}px, ${left}px)`,
        // clipPath: `url(/ora.svg#clip)`,
      },
    }
  }

  render({ blurred, isSmall }) {
    const styles = this.getStyle()
    const sectionProps = {
      setSection: this.setSection,
      ...this.props,
    }
    return (
      <page css={styles.page} ref={x => this.setRef(x)}>
        <Ora
          if={!blurred && this.state.ready && !isSmall}
          bounds={this.bounds}
          node={this.node}
          key={this.state.lastIntersection}
          showIndex={this.state.lastIntersection}
        />

        <contents css={{ overflow: 'hidden' }}>
          <HomeHeader />

          <HomeChat if={false} {...sectionProps} />
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
