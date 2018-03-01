// @flow
import * as React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Thing } from '~/app'
import Mousetrap from 'mousetrap'
import Screen from '@mcro/screen'
import ControlButton from '~/views/controlButton'
import Knowledge from './knowledge'

const keyParam = (window.location.search || '').match(/key=(.*)/)
const KEY = keyParam && keyParam[1]
const SHADOW_PAD = 15
const BORDER_RADIUS = 6
const HIDE_DELAY = 100
const background = 'rgb(255,255,255)'
const peekShadow = [[0, 3, SHADOW_PAD, [0, 0, 0, 0.05]]]

@view({
  store: class PeekStore {
    get peek() {
      return (
        Screen.electronState.peekState &&
        Screen.electronState.peekState.windows &&
        Screen.electronState.peekState.windows[0]
      )
    }

    isTorn = false
    isHovered = false
    isPinned = false
    pageLoaded = false
    showWebview = false
    tab = 'readability'

    @watch thing = () => this.target && Thing.get()

    get isConversation() {
      return this.thing && this.thing.type === 'conversation'
    }

    willMount() {
      this.trap = new Mousetrap(window)
      this.trap.bind('esc', () => {
        console.log('esc')
        this.isHovered = false
      })

      let hoverShow
      this.watch(() => {
        const word = Screen.hoveredWordName
        // ignore if holding option
        if (Screen.desktopState.keyboard.option) return
        clearTimeout(hoverShow)
        const hidden = !word
        hoverShow = setTimeout(() => {
          Screen.setState({ hidden })
        }, hidden ? 50 : 500)
      }, true)
    }

    @watch
    watchTab = () => {
      if (this.thing && !this.thing.body && this.thing.url) {
        this.tab = 'webview'
      }
    }

    @watch
    watchTear = () => {
      if (this.isTorn) return
      const { peek } = Screen.electronState.peekState
      if (peek && peek.isTorn) {
        console.log('tearing!', Screen.electronState.peekState)
        this.isTorn = true
      }
    }

    willUnmount() {
      this.trap.reset()
    }

    handleMouseEnter = () => {
      if (!this.isTorn) {
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
      Screen.setState({ closePeek: KEY })
    }
  },
})
export default class PeekPage {
  render({ store }) {
    const { peek, showWebview } = store
    const arrowTowards = (peek && peek.arrowTowards) || 'right'
    const arrowSize = 28
    let arrowPosition
    switch (arrowTowards) {
      case 'right':
        arrowPosition = {
          top: 53,
          right: SHADOW_PAD - arrowSize + 1,
        }
        break
      case 'left':
        arrowPosition = {
          top: 53,
          left: -3,
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

    const hasBody = store.thing && store.thing.body

    return (
      <UI.Theme name="light">
        <peek
          $peekVisible={!Screen.state.hidden}
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
              border={key === 1 ? '1px solid #ccc' : null}
              css={{
                position: 'absolute',
                ...arrowPosition,
                ...[
                  {
                    boxShadow: peekShadow,
                    zIndex: -1,
                  },
                  {
                    zIndex: 100,
                  },
                ][key],
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
                    if={false}
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
              <content>
                <Knowledge
                  if={Screen.appState.knowledge}
                  data={Screen.appState.knowledge}
                />
              </content>
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
      background: ['linear-gradient(#fff, #fff)'],
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
      // background: '#fff',
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
