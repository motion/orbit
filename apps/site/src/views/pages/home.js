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

const Logo = props => (
  <img
    src={`/logos/${props.name}.svg`}
    css={{
      display: 'inline-block',
      alignSelf: 'center',
      margin: [-18, 0, -12],
      width: 30,
      height: 30,
      // filter: `grayscale(100%) contrast(100%) blur(1px)`,
    }}
  />
)

const Icon = props => (
  <UI.Icon css={{ display: 'inline' }} size={30} {...props} />
)

const dark2 = UI.color(Constants.colorSecondary)
  .darken(0.75)
  .toString()

@view
export default class HomePage extends React.Component {
  bounds = []
  state = {
    ready: false,
  }

  componentDidMount() {
    this.setState({ ready: true })
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
          <UI.Theme name="dark">
            <View.Section
              padded
              css={{ background: `linear-gradient(${dark2}, #000)` }}
            >
              <View.SectionContent padRight>
                <inner css={{ padding: [100, 0] }}>
                  <View.Title size={3}>Ora keeps you in sync</View.Title>
                  <View.SubTitle opacity={1}>
                    Know about that <Logo name="slack" /> Slack conversation
                    before you open a duplicate <Logo name="jira" /> ticket.
                  </View.SubTitle>
                  <View.SubTitle opacity={0.5}>
                    Verify you're referencing the latest numbers in that{' '}
                    <Logo name="google-drive" /> planning document before you
                    hit send on that <Logo name="google-gmail" /> email.
                  </View.SubTitle>
                  <View.SubTitle opacity={0.5}>
                    Know that{' '}
                    <img
                      src="/steph.jpg"
                      css={{
                        width: 30,
                        height: 30,
                        borderRadius: 30,
                        display: 'inline',
                      }}
                    />{' '}
                    Lisa already wrote <Logo name="dropbox" /> notes for that
                    upcoming meeting.
                  </View.SubTitle>
                  <View.SubTitle opacity={0.5}>
                    Be the hero in <Logo name="slack" /> #devops by knowing that
                    a <Logo name="github-icon" /> ticket was just opened for the
                    very issue brought up.
                  </View.SubTitle>
                  <br />
                  <br />
                  <br />
                  <View.SubTitle opacity={0.5}>And much more.</View.SubTitle>
                  <br />
                  <br />
                  <br />
                  <div>
                    <View.SubTitle opacity={1}>
                      Orbit is the first ever knowledge assistant that knows
                      <View.Hl color="#000">everything</View.Hl> in your
                      company, and keeps it on hand{' '}
                      <View.Hl color="#000">anywhere</View.Hl> you are.
                    </View.SubTitle>
                  </div>
                </inner>
              </View.SectionContent>

              <nebula>
                <cloud
                  css={{
                    position: 'absolute',
                    bottom: -400,
                    right: -100,
                    width: 1200,
                    height: 500,
                    background: 'radial-gradient(orange, transparent 50%)',
                    zIndex: 2,
                    opacity: 0.15,
                    transform: {
                      z: 0,
                      scale: 3,
                    },
                  }}
                />
                <cloud
                  css={{
                    position: 'absolute',
                    bottom: -400,
                    right: -100,
                    width: 1000,
                    height: 800,
                    background: 'radial-gradient(red, transparent 50%)',
                    zIndex: 1,
                    opacity: 0.25,
                    transform: {
                      z: 0,
                      scale: 3,
                    },
                  }}
                />
                <cloud
                  css={{
                    position: 'absolute',
                    bottom: -200,
                    right: -300,
                    width: 500,
                    height: 500,
                    background: 'radial-gradient(black, transparent 50%)',
                    zIndex: 3,
                    opacity: 0.5,
                    transform: {
                      z: 0,
                      scale: 3,
                    },
                  }}
                />
              </nebula>
            </View.Section>
          </UI.Theme>
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
