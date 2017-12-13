// @flow
import * as React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OS } from '~/helpers'
import { Thing } from '~/app'
import marked from 'marked'
import Mousetrap from 'mousetrap'

const isSamePeek = (a, b) => a && b && a.id === b.id
const SHOW_DELAY = 0
const HIDE_DELAY = 50
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
      // preload
      if (this.nextPeek) {
        return this.nextPeek
      }
      // about to show different
      // if (
      //   this.nextPeek &&
      //   this.curPeek &&
      //   !isSamePeek(this.nextPeek, this.curPeek)
      // ) {
      //   return null
      // }
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
      this.on(OS, 'peek-to', (event, peek: ?Peek) => {
        if (this.isPinned) {
          console.log('ignore because pinned')
          return
        }
        console.log('peek-to', peek, this.lastPeek)
        if (isSamePeek(this.lastPeek, peek)) {
          return
        }
        this.nextPeek = peek
        clearTimeout(peekTimeout)
        clearTimeout(this.leftTimeout)
        const delay = peek ? SHOW_DELAY : HIDE_DELAY
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
            this.nextPeek = null
          }
        }, SHOW_DELAY)
      }
      this.nextPeek = null
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
        if (!this.curPeek) {
          this.nextPeek = null
        }
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
    const { peek, nextPeek } = store
    const peekUrl = (peek && peek.url) || (nextPeek && nextPeek.url)
    const arrowSize = 35
    // console.log('peekUrl', !!peekUrl, 'loaded?', store.pageLoaded)
    return (
      <UI.Theme name="light">
        <peek
          $peekVisible={peek}
          $peekPosition={[store.nextPeek || store.lastPeek, store.peek]}
          onMouseEnter={store.handlePeekEnter}
          onMouseLeave={store.handlePeekLeave}
        >
          <UI.Arrow
            size={arrowSize}
            towards="right"
            background={background}
            css={{
              position: 'absolute',
              top: 54,
              right: 20 - arrowSize,
            }}
          />
          <UI.Theme name="dark">
            <content $$draggable if={store.thing}>
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
    peekPosition: ([lastPeek, peek]) => ({
      transform: {
        y: peek
          ? peek.offsetTop
          : ((lastPeek && lastPeek.offsetTop) || 10) - 10,
      },
    }),
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
    },
    readability: {
      padding: 20,
    },
    content: {
      flex: 1,
      background,
      borderRadius: 10,
      opacity: 1,
      transition: 'background ease-in 200ms',
      boxShadow: [[0, 0, 20, [0, 0, 0, 0.2]]],
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
    },
    loading: {
      pointerEvents: 'none !important',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
  }
}
