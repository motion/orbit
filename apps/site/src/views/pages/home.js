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
import Orbitals from './home/orbitals'
import Header from './views/header'

@view
class Illustration2 {
  render(props) {
    return (
      <things
        $$row
        css={{
          flex: 1,
          marginRight: -140,
          justifyContent: 'center',
          userSelect: 'none',
        }}
        {...props}
      >
        <Orbitals
          rings={2}
          planetStyles={{
            background: '#fff',
            border: [1, Constants.colorMain],
          }}
          items={[
            'google-gmail',
            'google-drive',
            'slack',
            'confluence',
            'zendesk',
          ]}
          css={{
            top: -170,
            left: 220,
            transform: {
              scale: 0.666,
            },
          }}
        />

        <stage
          css={{
            flexFlow: 'row',
            alignItems: 'flex-end',
            margin: [0, 'auto'],
          }}
        >
          <figure
            css={{
              marginRight: -30,
              zIndex: 100,
              height: 180,
            }}
          >
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

          <figure
            css={{
              marginRight: -30,
              zIndex: 100,
              height: 180,
            }}
          >
            <img
              src="/figures/Hummingbird.svg"
              css={{
                margin: [-220, 0, 0, -40],
                width: 150,
                height: 150,
                zIndex: 1000,
                alignSelf: 'flex-end',
              }}
            />
          </figure>

          <figure css={{ marginRight: 0, zIndex: 100 }}>
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
        <stage
          css={{
            height: 300,
            flexFlow: 'row',
            flex: 1,
            alignItems: 'flex-end',
          }}
        >
          <figure
            css={{
              marginRight: -30,
              marginBottom: 30,
              zIndex: 100,
              height: 185,
            }}
          >
            <bubble
              css={{
                width: 110,
                height: 110,
                margin: [0, 0, -65, 0],
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
                  width: '35%',
                  height: '35%',
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
                margin: [0, 55, -50, 0],
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
                  width: '35%',
                  height: '35%',
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
              transform: { rotate: '-10deg', scale: 0.65 },
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
              transform: { rotate: '15deg', scale: 0.65 },
              top: 10,
              right: 0,
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
              src="/logos/github-icon.svg"
              css={{
                width: '60%',
                height: '60%',
              }}
            />
          </icon>

          <icon
            css={{
              transform: { rotate: '-15deg', scale: 0.85 },
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
                transform: { rotate: '-10deg', scale: 0.85 },
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
      // opacity: 0.25,
      width: 45,
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 0,
    },
  }
}

const dark1 = UI.color(Constants.colorMain)
  .darken(0.7)
  .toString()
const dark2 = UI.color(Constants.colorSecondary)
  .darken(0.45)
  .toString()

@view
class HomeHeader2 {
  render() {
    return (
      <View.Section
        css={{
          position: 'relative',
          background: `linear-gradient(-195deg, ${dark1}, ${dark2})`,
          overflow: 'hidden',
        }}
      >
        <Header />

        <View.SectionContent
          css={{
            margin: 'auto',
            padding: [300, 0, 50],
          }}
        >
          <content
            $$row
            css={{
              justifyContent: 'space-between',
            }}
          >
            <UI.Theme name="dark">
              <section
                css={{
                  marginTop: -70,
                  // marginBottom: 40,
                  height: 560,
                  position: 'relative',
                  width: '45%',
                  transform: {
                    y: -120,
                  },
                }}
              >
                <View.Title size={2.8} fontWeight={300} textAlign="right">
                  Company knowledge shouldn't be such a pain
                </View.Title>

                <inner
                  css={{
                    position: 'relative',
                    margin: [70, 0, 40, 0],
                    userSelect: 'none',
                  }}
                >
                  <img
                    src="/watercolor.png"
                    css={{
                      position: 'absolute',
                      top: 0,
                      opacity: 0.6,
                      left: -40,
                      width: 2022,
                      height: 904,
                      zIndex: 0,
                      transformOrigin: 'top left',
                      transform: { scale: 0.5 },
                      filter: 'hue-rotate(-45deg) brightness(0.99)',
                      margin: '-20%',
                    }}
                  />
                  <Illustration1 css={{ transform: { scale: 1 } }} />
                </inner>
              </section>
            </UI.Theme>
            <stripeBetween
              $$fullscreen
              css={{
                // left: 0,
                left: '50%',
                marginRight: -720,
                background: '#fff',
                zIndex: 10,
                transform: {
                  rotate: '98deg',
                  scale: 1,
                  y: 155,
                },
              }}
            />
            <section
              css={{
                marginTop: -20,
                width: '45%',
                zIndex: 20,
                position: 'relative',
                transform: {
                  y: -50,
                },
              }}
            >
              <inner
                css={{
                  position: 'relative',
                  minHeight: 250,
                  margin: [20, 0, 0],
                  userSelect: 'none',
                }}
              >
                <Illustration2 css={{ transform: { scale: 1 } }} />
              </inner>

              <text css={{ margin: [60, 0, 0, 40] }}>
                <View.Title
                  textAlign="left"
                  size={2.8}
                  fontWeight={300}
                  color={dark2}
                >
                  Orbit keeps your team in sync without hassle.
                </View.Title>

                <afterwards
                  if={false}
                  css={{
                    marginTop: 30,
                    fontFamily: 'Hand of Sean',
                    fontSize: 20,
                    color: Constants.colorMain,
                    opacity: 0.75,
                  }}
                >
                  & lets you stop worrying about the cloud.
                </afterwards>
              </text>
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
            pointerEvents: homeStore.show ? 'auto' : 'none',
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
