import * as React from 'react'
import { findDOMNode } from 'react-dom'
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
import HomeIntegrations from './home/sectionIntegrations'
import Logo from './home/logo'
import Orbitals from './home/orbitals'

// {/* <img
//                     src="/figures/Hummingbird.svg"
//                     css={{
//                       width: 200,
//                       height: 200,
//                       zIndex: 1000,
//                     }}
//                   />
//                   <img
//                     src="/figures/Snail.svg"
//                     css={{
//                       width: 200,
//                       height: 200,
//                       zIndex: 1000,
//                     }}
//                   />
//                   <img
//                     src="/figures/Rabbit.svg"
//                     css={{
//                       width: 200,
//                       height: 200,
//                       zIndex: 1000,
//                     }}
//                   />
//                   <img
//                     src="/figures/Mailbox.svg"
//                     css={{
//                       width: 200,
//                       height: 200,
//                       zIndex: 1000,
//                     }}
//                   />
//                   <img
//                     src="/figures/Wellington Boots.svg"
//                     css={{
//                       width: 200,
//                       height: 200,
//                       zIndex: 1000,
//                     }}
//                   /> */}

@view
class Illustration1 {
  render(props) {
    return (
      <things
        $$row
        css={{
          flex: 1,
          justifyContent: 'center',
          userSelect: 'none',
        }}
        {...props}
      >
        <stage css={{ flexFlow: 'row', flex: 1, alignItems: 'flex-end' }}>
          <figure
            css={{
              marginRight: -30,
              zIndex: 100,
              height: 180,
            }}
          >
            <bubble
              css={{
                width: 110,
                height: 110,
                margin: [0, 0, -70, 0],
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/figures/Cloud 2.svg"
                css={{
                  width: 150,
                  height: 150,
                }}
              />
              <img
                src="/logos/google-drive.svg"
                css={{
                  width: '25%',
                  height: '25%',
                  marginLeft: -5,
                  marginTop: 4,
                  position: 'absolute',
                }}
              />
            </bubble>
            <img
              src="/figures/Snail.svg"
              css={{
                margin: [0, 0, 0, -150],
                width: 150,
                height: 150,
                zIndex: 1000,
                alignSelf: 'flex-end',
              }}
            />
          </figure>

          <space css={{ minWidth: 100, flex: 1 }} />

          <figure css={{ marginRight: -30, zIndex: 100 }}>
            <bubble
              css={{
                width: 110,
                height: 110,
                margin: [0, 55, -70, 0],
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/figures/Cloud 2.svg"
                css={{
                  width: 150,
                  height: 150,
                }}
              />
              <img
                src="/logos/slack.svg"
                css={{
                  width: '25%',
                  height: '25%',
                  marginLeft: -5,
                  marginTop: 4,
                  position: 'absolute',
                }}
              />
            </bubble>
            <img
              src="/figures/Rabbit.svg"
              css={{
                width: 150,
                height: 150,
                alignSelf: 'flex-end',
                transform: { scaleX: -1 },
              }}
            />
          </figure>
        </stage>

        <sky $$fullscreen>
          <icon
            css={{
              transform: { rotate: '-10deg' },
              top: 30,
              left: 0,
            }}
          >
            <img
              src="/logos/base.svg"
              css={{
                width: '60%',
                height: '60%',
              }}
            />
          </icon>

          <icon
            css={{
              transform: { rotate: '15deg' },
              top: 10,
              right: -40,
            }}
          >
            <img
              src="/logos/twitter.svg"
              css={{
                width: '50%',
                height: '50%',
              }}
            />
          </icon>

          <icon
            css={{
              transform: { rotate: '5deg', scale: 0.8 },
              top: 60,
              left: 200,
            }}
          >
            <img
              src="/logos/github-octocat.svg"
              css={{
                width: '80%',
                height: '80%',
              }}
            />
          </icon>

          <icon
            css={{
              transform: { rotate: '-15deg' },
              top: 30,
              left: 130,
            }}
          >
            <img
              src="/logos/markdown.svg"
              css={{
                width: '60%',
                height: '60%',
              }}
            />
          </icon>

          <icon
            css={{
              transform: { rotate: '15deg', scale: 0.9 },
              top: 20,
              left: 270,
            }}
          >
            <img
              src="/logos/zendesk.svg"
              css={{
                width: '60%',
                height: '60%',
              }}
            />
          </icon>
        </sky>

        <floor
          css={{
            position: 'absolute',
            bottom: 10,
            left: 120,
            right: 90,
            flexFlow: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
          }}
        >
          <img
            src="/figures/Lavender.svg"
            css={{ width: 80, height: 80, opacity: 0 }}
          />
          <pile css={{ margin: [0, 60, 10], position: 'relative', width: 30 }}>
            <icon
              css={{
                transform: { rotate: '10deg', scale: 0.8 },
                bottom: 80,
              }}
            >
              <img
                src="/logos/asana.svg"
                css={{
                  width: '80%',
                  height: '80%',
                }}
              />
            </icon>
            <icon
              css={{
                transform: { rotate: '-10deg' },
                bottom: 10,
                left: -40,
              }}
            >
              <img
                src="/logos/mixpanel.svg"
                css={{
                  width: '80%',
                  height: '80%',
                }}
              />
            </icon>
            <icon
              css={{
                transform: { rotate: '20deg', scale: 0.9 },
                bottom: 10,
                left: 50,
              }}
            >
              <img
                src="/logos/google-gmail.svg"
                css={{
                  width: '50%',
                  height: '50%',
                }}
              />
            </icon>
          </pile>
          <img
            if={false}
            src="/figures/Pinecomb.svg"
            css={{
              width: 80,
              height: 80,
              transform: { rotate: '-25deg' },
            }}
          />
        </floor>
      </things>
    )
  }

  static style = {
    icon: {
      // border: [1, [0, 0, 255, 0.075]],
      background: [255, 255, 255, 0.1],
      borderRadius: 10,
      opacity: 0.25,
      width: 45,
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 0,
    },
  }
}

const MenuItem = props => (
  <item
    css={{ padding: [5, 30], fontWeight: 600, color: Constants.colorSecondary }}
    {...props}
  />
)

@view
class HomeHeader2 {
  render() {
    return (
      <View.Section
        css={{
          background: 'linear-gradient(#fff, #f2f2f2)',
        }}
      >
        <tophead
          css={{
            background: 'transparent',
            padding: [10, 0],
            position: 'relative',
            zIndex: 10,
          }}
        >
          <View.SectionContent row css={{ justifyContent: 'space-between' }}>
            <Logo color={Constants.colorMain} />

            <menu css={{ flexFlow: 'row', padding: [0, 100] }}>
              <MenuItem>For Sales</MenuItem>
              <MenuItem>For Support</MenuItem>
              <MenuItem>Pricing</MenuItem>
            </menu>

            <end>
              <UI.Button
                icon="saturn"
                size={1.5}
                sizeRadius={0.25}
                theme="green"
              >
                Download
              </UI.Button>
            </end>
          </View.SectionContent>
        </tophead>

        <bg
          if={false}
          $$fullscreen
          css={{
            background: 'radial-gradient(#fff, transparent)',
            top: '-10%',
            left: '-10%',
          }}
        />

        <View.SectionContent
          css={{
            margin: 'auto',
            padding: [50, 0, 100],
            zIndex: 0,
          }}
        >
          <img
            src="/watercolorlight.png"
            css={{
              position: 'absolute',
              top: 270,
              left: -180,
              width: 2022,
              height: 904,
              transformOrigin: 'top left',
              transform: { scale: 0.75 },
              margin: '-20%',
            }}
          />

          <content
            $$row
            css={{ margin: [100, 0, 150], justifyContent: 'space-between' }}
          >
            <section
              css={{
                marginTop: -50,
                marginBottom: 50,
                position: 'relative',
                width: '48%',
              }}
            >
              <View.Title size={2.8} fontWeight={200}>
                Company knowledge shouldn't be so messy
              </View.Title>

              <inner
                css={{
                  position: 'relative',
                  minHeight: 250,
                  margin: [25, 0, 50, 0],
                }}
              >
                <img
                  src="/watercolor3.png"
                  css={{
                    position: 'absolute',
                    top: '24%',
                    left: 0,
                    opacity: 0,
                    width: 2022,
                    height: 904,
                    transformOrigin: 'top left',
                    transform: { scale: 0.4 },
                    marginTop: '-20%',
                    marginLeft: '-60%',
                  }}
                />
                <Illustration1 css={{ transform: { scale: 1.15 } }} />
              </inner>
            </section>
            <section css={{ marginTop: 30, width: '45%' }}>
              <inner
                css={{
                  position: 'relative',
                  minHeight: 250,
                  margin: [20, 0, 0],
                }}
              >
                <things $$row css={{ margin: 'auto' }}>
                  <Orbitals
                    rings={1}
                    items={[
                      'google-gmail',
                      'google-drive',
                      'slack',
                      'confluence',
                      'zendesk',
                    ]}
                    css={{
                      top: -100,
                      left: 270,
                      transform: {
                        scale: 0.9,
                      },
                    }}
                  />
                </things>
              </inner>
              <View.Title textAlign="right" size={3} fontWeight={200}>
                Orbit keeps everyone on the same page
              </View.Title>
            </section>
          </content>
        </View.SectionContent>
      </View.Section>
    )
  }
}

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
            transition: 'opacity ease-in 400ms',
          }}
          homeStore={homeStore}
        />
        <contents css={{ overflow: 'hidden' }}>
          <HomeHeader2 />
          <HomeHeader />
          <HomeExamples {...sectionProps} />
          <HomeIntegrations {...sectionProps} />
          <HomeChat {...sectionProps} />
          <HomeSecurity {...sectionProps} />
          <HomeHandsFree {...sectionProps} />
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
        filter: 'blur(15px)',
      },
    }
  }

  static style = {
    contents: {
      // transform: {
      //   z: 0,
      // },
    },
  }
}
