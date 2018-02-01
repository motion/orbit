// @flow
import * as React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OS } from '~/helpers'
import { Thing } from '~/app'
import MarkdownRender from './markdownRenderer'
import Conversation from './conversation'
import Mousetrap from 'mousetrap'
import controlX from '~/../public/images/control-x.png'
import controlY from '~/../public/images/control-y.png'
import controlZ from '~/../public/images/control-z.png'

const icons = {
  x: controlX,
  y: controlY,
  z: controlZ,
}

const keyParam = (window.location.search || '').match(/key=(.*)/)
const KEY = keyParam && keyParam[1]
const SHADOW_PAD = 15
const BORDER_RADIUS = 6
const SHOW_DELAY = 300
const HIDE_DELAY = 100

const background = '#fff'
const peekShadow = [[0, 3, SHADOW_PAD, [0, 0, 0, 0.25]]]

type Target = {
  url?: string,
  top?: number,
  left: number,
  width: number,
  height: number,
  id: number,
}

@view
class ControlButton {
  render({ store, background = '#ED6A5F', icon }) {
    return (
      <controlButton onClick={store.closePeek} css={{ background }}>
        <img src={icons[icon]} />
      </controlButton>
    )
  }

  static style = {
    controlButton: {
      width: 12,
      height: 12,
      borderRadius: 100,
      boxShadow: ['inset 0 0 0 0.5px rgba(0,0,0,0.15)'],
      alignItems: 'center',
      marginRight: 8,
      justifyContent: 'center',
      '& > img': {
        opacity: 0,
      },
      '&:hover > img': {
        opacity: 1,
      },
    },
  }
}

@view
class WebView {
  render({ getRef, ...props }) {
    return (
      <webview
        ref={getRef}
        css={{ width: '100%', height: '100%' }}
        {...props}
      />
    )
  }

  static style = {
    location: {
      padding: 3,
    },
  }
}

@view({
  store: class PeekStore {
    peek = null
    lastTarget: ?Peek = null
    curTarget: ?Peek = null
    isTorn = false
    isHovered = false
    isPinned = false
    pageLoaded = false
    showWebview = false
    tab = 'readability'

    @watch thing = () => this.target && Thing.get(this.target.id)

    get target() {
      // during hover its null so show it cached
      if (this.isHovered || this.isPinned || this.isTorn) {
        return this.lastTarget // || {}
      }
      // current
      return this.curTarget
    }

    get isConversation() {
      return this.thing && this.thing.type === 'conversation'
    }

    willMount() {
      OS.send('peek-start')

      this.watchTab()
      this.watchPeekTo()
      this.watchTear()

      this.trap = new Mousetrap(window)
      this.trap.bind('esc', () => {
        console.log('esc')
        this.isHovered = false
      })

      this.setTimeout(() => {
        this.showWebview = true
      }, 150)
    }

    watchTab() {
      this.watch(function watchTab() {
        if (this.thing && !this.thing.body && this.thing.url) {
          this.tab = 'webview'
        }
      })
    }

    watchTear = () => {
      this.on(OS, 'peek-tear', () => {
        this.isTorn = true
      })
    }

    watchPeekTo = () => {
      this.on(OS, 'peek-to', (event, { peek, target }) => {
        if (this.isPinned) {
          console.log('ignore because pinned')
          return
        }
        console.log('peek-to', { peek, target })
        this.updateTarget(target)
        this.peek = peek
      })
    }

    willUnmount() {
      this.trap.reset()
    }

    updateTarget = (target: Target) => {
      this.curTarget = target
      if (target) {
        this.lastTarget = target
      }
      if (!target) {
        this.leftTimeout = this.setTimeout(() => {
          if (!this.isHovered) {
            this.lastTarget = null
          }
        }, SHOW_DELAY)
      }
    }

    handleMouseEnter = () => {
      if (!this.isTorn) {
        // OS.send('peek-focus')
        clearTimeout(this.leftTimeout)
        this.isHovered = true
      }
    }

    handleMouseLeave = () => {
      // timeout here prevent flicker on re-enter same item
      this.setTimeout(() => {
        this.isHovered = false
      }, HIDE_DELAY)
    }

    handlePageRef = ref => {
      if (!ref) return
      this.pageRef = ref
      if (this.offLoad) {
        this.offLoad()
      }
      this.pageLoaded = false
      const loadPage = () => {
        if (!this.pageLoaded) {
          this.pageLoaded = true
        }
      }
      // const offFinishLoad = this.on(ref, 'did-finish-load', loadPage)
      // after a second just load anyway
      const offTimeoutLoad = this.setTimeout(loadPage, 1000)
      this.offLoad = () => {
        // offFinishLoad()
        clearTimeout(offTimeoutLoad)
      }
    }

    toggleWebview = () => {
      if (this.tab === 'webview') {
        this.tab = 'readability'
      } else {
        this.tab = 'webview'
      }
    }

    closePeek = () => {
      OS.send('peek-close', KEY)
    }
  },
})
export default class PeekPage {
  render({ store }) {
    const { peek, target, showWebview } = store
    const targetUrl = target && target.url
    const arrowTowards = (peek && peek.arrowTowards) || 'right'
    const arrowSize = SHADOW_PAD * 2
    let arrowPosition

    console.log('Peek.render', 'target', target)

    switch (arrowTowards) {
      case 'right':
        arrowPosition = {
          top: 53,
          right: SHADOW_PAD - arrowSize + 1,
        }
        break
      case 'left':
        arrowPosition = {
          top: 35,
          left: -SHADOW_PAD,
        }
        break
      case 'bottom':
        arrowPosition = {
          bottom: -SHADOW_PAD,
          left: '50%',
        }
        break
      case 'top':
        arrowPosition = {
          top: -SHADOW_PAD,
          left: '50%',
        }
        break
    }

    const arrowStyles = [
      {
        boxShadow: peekShadow,
        zIndex: -1,
      },
      {
        zIndex: 100,
      },
    ]

    const hasBody = store.thing && store.thing.body

    return (
      <UI.Theme name="light">
        <peek
          $peekVisible={!!target}
          $peekTorn={store.isTorn}
          onMouseEnter={store.handleMouseEnter}
          onMouseLeave={store.handleMouseLeave}
        >
          {/* first is arrow (above), second is arrow shadow (below) */}
          {[1, 2].map(key => (
            <UI.Arrow
              if={!store.isTorn}
              key={key}
              size={arrowSize}
              towards={arrowTowards}
              background={background}
              css={{
                position: 'absolute',
                ...arrowPosition,
                ...arrowStyles[key],
              }}
            />
          ))}
          <content>
            <contentInner $$flex>
              <header $$draggable>
                <buttons $$row if={store.isTorn} css={{ marginRight: 14 }}>
                  <ControlButton icon="x" store={store} />
                  <ControlButton icon="y" store={store} background="#F6BE4F" />
                  <ControlButton icon="z" store={store} background="#62C554" />
                </buttons>
                <title>
                  <UI.Title size={1} fontWeight={300}>
                    {(store.thing && store.thing.title) || ''}
                  </UI.Title>
                </title>
                <UI.Row
                  $controls
                  $$undraggable
                  itemProps={{
                    sizeIcon: 1,
                    sizePadding: 1.8,
                    sizeHeight: 0.75,
                    sizeRadius: 0.6,
                    borderWidth: 0,
                    color: [0, 0, 0, 0.5],
                    boxShadow: [
                      'inset 0 0.5px 0 0px #fff',
                      '0 0.25px 0.5px 0px rgba(0,0,0,0.35)',
                    ],
                    background: 'linear-gradient(#FDFDFD, #F1F1F1)',
                    hover: {
                      background: 'linear-gradient(#FDFDFD, #F1F1F1)',
                    },
                  }}
                >
                  <UI.Button
                    if={targetUrl}
                    icon="globe"
                    onClick={store.toggleWebview}
                    highlight={store.tab === 'webview'}
                    disabled={!hasBody}
                    dimmed={!hasBody}
                  />
                  <UI.Button
                    if={!store.isTorn}
                    icon="pin"
                    onClick={store.ref('isPinned').toggle}
                    highlight={store.isTorn || store.isPinned}
                  />
                </UI.Row>
              </header>
              <tabs if={store.thing}>
                <tab $visible={store.tab === 'readability'}>
                  <readability>
                    <MarkdownRender
                      if={!store.isConversation && store.thing.body}
                      markdown={store.thing.body}
                    />
                    <Conversation
                      if={store.isConversation}
                      thing={store.thing}
                    />
                  </readability>
                </tab>
                <tab $visible={store.tab === 'webview'}>
                  <loading if={!store.pageLoaded}>
                    <UI.Text color="#000">Loading</UI.Text>
                  </loading>
                  <WebView
                    if={targetUrl && showWebview}
                    $contentLoading={!store.pageLoaded}
                    $webview
                    key={targetUrl}
                    src={targetUrl.replace('deliverx.com', 'deliverx.com:5000')}
                    getRef={store.handlePageRef}
                  />
                  <bottombar
                    css={{
                      width: '100%',
                      borderTop: [1, '#eee'],
                      alignItems: 'center',
                    }}
                  >
                    <UI.Text size={0.8} alpha={0.5}>
                      {targetUrl}
                    </UI.Text>
                  </bottombar>
                </tab>
              </tabs>
            </contentInner>
          </content>
        </peek>
      </UI.Theme>
    )
  }

  static style = {
    peek: {
      alignSelf: 'flex-end',
      width: '100%',
      height: '100%',
      padding: SHADOW_PAD,
      pointerEvents: 'none !important',
      transition: 'all ease-in 100ms',
      opacity: 0,
    },
    peekVisible: {
      pointerEvents: 'all !important',
      opacity: 1,
      transition: 'all ease-out 100ms',
    },
    peekTorn: {
      pointerEvents: 'all !important',
      opacity: 1,
      transform: {
        y: 0,
      },
    },
    content: {
      flex: 1,
      // border: [1, 'transparent'],
      borderRadius: BORDER_RADIUS,
      overflow: 'hidden',
      opacity: 1,
      transition: 'background ease-in 200ms',
      boxShadow: [peekShadow, '0 0 0 0.5px rgba(0,0,0,0.25)'],
    },
    contentInner: {
      background,
    },
    header: {
      height: 37,
      flexFlow: 'row',
      alignItems: 'center',
      padding: [4, 10],
      background: ['linear-gradient(#E6E6E6, #D9D9D9)'],
      borderTopRadius: BORDER_RADIUS,
      boxShadow: [
        'inset 0 1px 0 rgba(255,255,255,0.4)',
        'inset 0 -0.5px 0 #bbb',
      ],
    },
    controls: {
      padding: [0, 0, 0, 10],
    },
    title: {
      flex: 1,
      justifyContent: 'center',
    },
    tab: {
      flex: 1,
      opacity: 0,
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      pointerEvents: 'none',
    },
    readability: {
      padding: [5, 15],
    },
    tabs: {
      flex: 1,
      overflowX: 'hidden',
      overflowY: 'scroll',
      position: 'relative',
    },
    contentLoading: {
      // opacity: 0.3,
    },
    webview: {
      height: '94%',
      width: '100%',
      background: '#fff',
    },
    visible: {
      opacity: 1,
      pointerEvents: 'auto',
    },
    loading: {
      pointerEvents: 'none !important',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
  }
}
