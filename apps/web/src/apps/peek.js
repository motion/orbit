// @flow
import * as React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OS } from '~/helpers'
import { Thing } from '~/app'
import marked from 'marked'
import Mousetrap from 'mousetrap'

// const isSamePeek = (a, b) => a && b && a.id === b.id
const SHOW_DELAY = 300
const HIDE_DELAY = 100
const background = [20, 20, 20, 0.98]

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

@view({
  store: class PeekStore {
    lastPeek: ?Peek = null
    curPeek: ?Peek = null
    nextPeek: ?Peek = null
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

      this.trap = new Mousetrap(window)
      this.trap.bind('esc', () => {
        console.log('esc')
        this.isHovered = false
      })
    }

    willUnmount() {
      this.trap.reset()
    }

    updatePeek = (peek: Peek) => {
      this.curPeek = peek
      if (peek) {
        this.lastPeek = peek
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
      OS.send('peek-focus')
      clearTimeout(this.leftTimeout)
      this.isHovered = true
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
  },
})
export default class PeekPage {
  render({ store }) {
    const { peek } = store
    const peekUrl = peek && peek.url
    const arrowSize = 42
    const peekY = (store.peek || store.lastPeek || {}).offsetTop || 0
    // console.log('peekUrl', !!peekUrl, 'loaded?', store.pageLoaded)
    return (
      <UI.Theme name="light">
        <peek
          $peekVisible={peek}
          $peekPosition={peekY - 30}
          onMouseEnter={store.handlePeekEnter}
          onMouseLeave={store.handlePeekLeave}
        >
          <UI.Arrow
            size={arrowSize}
            towards="right"
            background={background}
            css={{
              position: 'absolute',
              top: 44,
              right: 20 - arrowSize,
            }}
          />
          <UI.Theme name="dark">
            <content $$draggable>
              <innerContent $$flex if={store.thing}>
                <header>
                  <title>
                    <UI.Title selectable size={1.5} fontWeight={600}>
                      {store.thing.title}
                    </UI.Title>
                  </title>
                  <UI.Row
                    $controls
                    itemProps={{ circular: true, sizePadding: 1.5 }}
                  >
                    <UI.Button
                      if={peekUrl}
                      icon="globe"
                      onClick={store.toggleWebview}
                      highlight={store.tab === 'webview'}
                    />
                    <UI.Button
                      icon="pin"
                      onClick={store.ref('isPinned').toggle}
                      highlight={store.isPinned}
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
                      src={peekUrl}
                      getRef={store.handlePageRef}
                    />
                  </tab>
                </tabs>
              </innerContent>
            </content>
          </UI.Theme>
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
      padding: 20,
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
