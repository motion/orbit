// @flow
import * as React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OS } from '~/helpers'
import { Thing } from '~/app'
import marked from 'marked'
import Mousetrap from 'mousetrap'

// const isSamePeek = (a, b) => a && b && a.id === b.id
const keyParam = (window.location.search || '').match(/key=(.*)/)
const KEY = keyParam && keyParam[1]
const SHOW_DELAY = 300
const HIDE_DELAY = 100
const background = [255, 255, 255, 0.98]

type Peek = {
  url?: string,
  offsetTop?: number,
  id: number,
}

@view
class WebView {
  render({ getRef, ...props }) {
    return <webview ref={getRef} {...props} />
  }
}

// for hmr
window.cachedPeek = null

@view({
  store: class PeekStore {
    lastPeek: ?Peek = window.cachedPeek
    curPeek: ?Peek = window.cachedPeek
    nextPeek: ?Peek = window.cachedPeek
    isTorn = !!window.cachedPeek
    isHovered = false
    isPinned = false
    pageLoaded = false
    tab = 'readability'

    @watch thing = () => this.peek && Thing.get(this.peek.id)

    get peek() {
      // during hover its null so show it cached
      if (this.isHovered || this.isPinned) {
        return this.lastPeek
      }
      // current
      return this.curPeek
    }

    willMount() {
      OS.send('peek-start')

      this.watchPeekTab()
      this.watchPeekTo()
      this.watchPeekTear()

      this.trap = new Mousetrap(window)
      this.trap.bind('esc', () => {
        console.log('esc')
        this.isHovered = false
      })
    }

    watchPeekTab() {
      this.watch(function watchPeek() {
        if (this.thing && !this.thing.body && this.thing.url) {
          this.tab = 'webview'
        }
      })
    }

    watchPeekTear = () => {
      this.on(OS, 'peak-tear', () => {
        this.isTorn = true
        this.isPinned = true
      })
    }

    watchPeekTo = () => {
      let peekTimeout
      // this stores null peeks as well for comparison later
      // to see if we are already open and just moving down list
      let lastPeek
      this.on(OS, 'peek-to', (event, peek: ?Peek) => {
        if (this.isPinned) {
          console.log('ignore because pinned')
          return
        }
        console.log('peek-to', peek, this.lastPeek)
        let delay = HIDE_DELAY
        if (peek) {
          delay = lastPeek ? 0 : SHOW_DELAY
        }
        lastPeek = peek
        clearTimeout(peekTimeout)
        clearTimeout(this.leftTimeout)
        peekTimeout = this.setTimeout(() => this.updatePeek(peek), delay)
      })
    }

    willUnmount() {
      this.trap.reset()
    }

    updatePeek = (peek: Peek) => {
      this.curPeek = peek
      if (peek) {
        this.lastPeek = peek
        window.cachedPeek = peek
      }
      if (!peek) {
        this.leftTimeout = this.setTimeout(() => {
          if (!this.isHovered) {
            this.lastPeek = null
          }
        }, SHOW_DELAY)
      }
    }

    handlePeekEnter = () => {
      if (!this.isTorn) {
        OS.send('peek-focus')
        clearTimeout(this.leftTimeout)
        this.isHovered = true
      }
    }

    handlePeekLeave = () => {
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
    const { peek } = store
    const peekUrl = peek && peek.url
    const arrowSize = 32
    const peekY = (store.peek || store.lastPeek || {}).offsetTop || 0
    // console.log('peekUrl', !!peek.body, 'loaded?', store.pageLoaded)
    return (
      <UI.Theme name="light">
        <peek
          $peekVisible={peek}
          $peekPosition={peekY - 20}
          onMouseEnter={store.handlePeekEnter}
          onMouseLeave={store.handlePeekLeave}
        >
          <UI.Arrow
            if={!store.isTorn}
            size={arrowSize}
            towards="right"
            background={background}
            css={{
              position: 'absolute',
              top: 35,
              right: 20 - arrowSize,
            }}
          />
          <content>
            <innerContent $$flex if={store.thing}>
              <header $$draggable>
                <title>
                  <UI.Title size={1} fontWeight={600}>
                    {store.thing.title}
                  </UI.Title>
                </title>
                <UI.Row
                  $controls
                  $$undraggable
                  itemProps={{ sizePadding: 1.75, sizeRadius: 2 }}
                >
                  <UI.Button
                    if={peekUrl}
                    icon="globe"
                    onClick={store.toggleWebview}
                    highlight={store.tab === 'webview'}
                    disabled={!store.thing.body}
                    dimmed={!store.thing.body}
                  />
                  <UI.Button
                    if={!store.isTorn}
                    icon="pin"
                    onClick={store.ref('isPinned').toggle}
                    highlight={store.isTorn || store.isPinned}
                  />
                  <UI.Button
                    if={store.isTorn}
                    icon="remove"
                    onClick={store.closePeek}
                  />
                </UI.Row>
              </header>
              <tabs>
                <tab $visible={store.tab === 'readability'}>
                  <readability>
                    <UI.Text selectable size={1.2}>
                      <div
                        className="html-content"
                        $$flex
                        onClick={e => {
                          if (e.currentTarget.tagName === 'A') {
                            e.preventDefault()
                            console.log(
                              'e.currentTarget.href',
                              e.currentTarget.href
                            )
                            OS.send('open-browser', e.currentTarget.href)
                          }
                        }}
                        dangerouslySetInnerHTML={{
                          __html: marked(store.thing.body),
                        }}
                      />
                    </UI.Text>
                  </readability>
                </tab>
                <tab $visible={store.pageLoaded && store.tab === 'webview'}>
                  <loading if={!store.pageLoaded}>
                    <UI.Text>Loading</UI.Text>
                  </loading>
                  <WebView
                    if={peekUrl}
                    $contentLoading={!store.pageLoaded}
                    $webview
                    key={peekUrl}
                    src={peekUrl.replace('deliverx.com', 'deliverx.com:5000')}
                    getRef={store.handlePageRef}
                  />
                </tab>
              </tabs>
            </innerContent>
          </content>
        </peek>
      </UI.Theme>
    )
  }

  static style = {
    peek: {
      width: '100%',
      height: 600,
      padding: 20,
      pointerEvents: 'none !important',
      transition: 'all ease-in 100ms',
      opacity: 0,
    },
    peekVisible: {
      pointerEvents: 'all !important',
      opacity: 1,
      transition: 'all ease-out 100ms',
    },
    peekPosition: y => ({
      transform: {
        y,
      },
    }),
    content: {
      flex: 1,
      background,
      borderRadius: 10,
      opacity: 1,
      transition: 'background ease-in 200ms',
      boxShadow: [[0, 0, 20, [0, 0, 0, 0.2]]],
    },
    header: {
      flexFlow: 'row',
      alignItems: 'center',
      padding: [10, 15],
      borderBottom: [1, [255, 255, 255, 0.09]],
    },
    controls: {
      padding: [0, 0, 0, 10],
      alignSelf: 'flex-start',
    },
    title: {
      flex: 1,
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
      padding: 20,
    },
    tabs: {
      flex: 1,
      overflowX: 'hidden',
      overflowY: 'scroll',
      position: 'relative',
    },
    contentLoading: {
      opacity: 0.3,
    },
    webview: {
      height: '100%',
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
