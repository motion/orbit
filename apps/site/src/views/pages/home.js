import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as View from '~/views'
import * as Constants from '~/constants'
import { throttle } from 'lodash'
import Ora from './ora'
import HomeHeader from './home/header'

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

  setSection(index) {
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
    const right = window.innerWidth - pad - Constants.ORA_BORDER_RADIUS
    const left =
      window.innerWidth -
      Constants.ORA_WIDTH -
      pad +
      Constants.ORA_BORDER_RADIUS
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

          <View.Section css={{ background: '#fff' }} padded>
            <View.SectionContent padRight $padBottom>
              <img
                if={!isSmall}
                css={{
                  position: 'absolute',
                  top: -35,
                  right: -370,
                  transition: 'all ease-in 300ms',
                  animation: 'rotate 120s infinite linear',
                }}
                src="/orbitals.svg"
              />
              <View.Title
                getRef={this.setSection(1)}
                color={Constants.colorBlue}
                size={3}
              >
                Hands-free Intelligence
              </View.Title>
              <View.Text size={2} fontWeight={600} opacity={0.5}>
                An assistant that's always there, not hidden in a tab or bot.
              </View.Text>
              <View.Text size={1.7}>
                <ol $list>
                  <li>
                    Orbit hooks into <em>every</em> cloud service, including
                    email and chat.
                  </li>
                  <li>
                    Using machine learning, Orbit understands{' '}
                    <strong>when</strong> to show relevant items, and
                    understands "accounting paperwork" can mean "tax form".
                  </li>
                  <li>
                    Orbit stays with you: while chatting, writing emails,
                    updating your CRM, or just browsing.
                  </li>
                </ol>
              </View.Text>
            </View.SectionContent>
            <bottomSlant $dark />
          </View.Section>

          <UI.Theme name="dark">
            <View.Section padded $dark>
              <bottomSlant css={{ background: '#fff' }} />
              <View.SectionContent padRight $padBottom>
                <after
                  css={{
                    position: 'absolute',
                    top: 0,
                    right: -200,
                    bottom: 0,
                    justifyContent: 'center',
                    opacity: 0.4,
                  }}
                >
                  <UI.Icon color="#000" size={501} name="lock" />
                </after>
                <View.Title getRef={this.setSection(2)} size={3}>
                  The No-Cloud Infrastructure
                </View.Title>
                <View.Text size={2} fontWeight={600} opacity={0.7}>
                  In order to work, Orbit needed to invent a new model: one that
                  keeps you safe.
                </View.Text>
                <View.SubText>
                  Here's the rub. To provide great context, Orbit needs to hook
                  into a lot of company data to be valuable. Your Slack, email,
                  documents, tasks, company knowledge.
                </View.SubText>

                <View.SubText>
                  How can we do that completely securely?
                </View.SubText>

                <View.SubText>
                  Answer: the data never once leaves your local computer. We
                  never see it, and neither does anyone else.
                </View.SubText>
                <View.SubText>
                  <View.Hl color="#000">
                    This allows us to be ambitious from day one without
                    compromise.
                  </View.Hl>{' '}
                  Orbit can crawl everything that's relevant to you and your
                  team without fear of data breaches, permissions exposures, or
                  the need to run a complicated on-prem installs.
                </View.SubText>
              </View.SectionContent>
            </View.Section>
          </UI.Theme>

          <footer>
            <View.Section css={{ padding: [250, 0] }} $$centered padded>
              <View.SectionContent>
                <View.Text size={3}>
                  Orbit is going into private beta in December.
                </View.Text>
                <View.Text size={2}>
                  <a href="mailto:natewienert@gmail.com">Send us an email</a> if
                  you're interested.
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
        filter: 'blur(25px)',
      },
    }
  }

  static style = {
    contents: {},
    a: {
      color: '#5420a5',
      textDecoration: 'underline',
    },
    padBottom: {
      paddingBottom: 80,
    },
    dark: {
      background: Constants.colorBlue,
    },
    narrow: {
      maxWidth: 500,
      alignSelf: 'center',
    },
    topSlant: {
      position: 'absolute',
      top: -320,
      left: -500,
      right: -500,
      height: 400,
      zIndex: 0,
      transform: {
        rotate: '-1.5deg',
      },
    },
    bottomSlant: {
      position: 'absolute',
      bottom: -350,
      left: -500,
      right: -500,
      height: 400,
      zIndex: 0,
      transform: {
        rotate: '-1deg',
      },
    },
    screen: {
      marginTop: 25,
      marginBottom: -25,
      zIndex: 100,
      width: 2054 / 3,
      height: 1762 / 3,
      alignSelf: 'center',
    },
    liTitle: {
      marginLeft: 15,
      marginBottom: 0,
    },
    mainList: {
      padding: [0, 20],

      '& > li': {
        listStylePosition: 'inside',
        listStyleType: 'decimal-leading-zero',
        margin: [0, 0, 0, -40],
      },
    },
    list: {
      '& > li': {
        listStylePosition: 'auto',
        listStyleType: 'decimal',
        margin: [0, 0, 15, 30],
      },
    },
    hr: {
      display: 'flex',
      height: 0,
      border: 'none',
      borderTop: [1, [0, 0, 0, 0.05]],
      paddingBottom: 20,
      marginTop: 20,
    },
    strong: {
      fontWeight: 500,
    },
    break: {
      height: 30,
    },
    starry: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 0,
      backgroundImage: `url(/4-point-stars.svg)`,
      backgroundSize: '1%',
    },
  }
}
