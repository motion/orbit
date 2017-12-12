// @flow
import * as React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OS } from '~/helpers'
import { Thing } from '~/app'
import marked from 'marked'
import Mousetrap from 'mousetrap'

const isSamePeek = (a, b) => a && b && a.id === b.id
const SHOW_DELAY = 500
const HIDE_DELAY = 200

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
    pageLoaded = false

    @watch thing = () => this.peek && Thing.get(this.peek.id)

    get peek() {
      // preload
      if (this.nextPeek && !this.curPeek) {
        return this.nextPeek
      }
      // about to show different
      if (
        this.nextPeek &&
        this.curPeek &&
        !isSamePeek(this.nextPeek, this.curPeek)
      ) {
        return null
      }
      // during hover its null so show it cached
      if (this.isHovered) {
        return this.lastPeek
      }
      // current
      return this.curPeek
    }

    willMount() {
      OS.send('peek-start')

      let peekTimeout
      this.on(OS, 'peek-to', (event, peek: ?Peek) => {
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
  },
})
export default class PeekPage {
  render({ store }) {
    const { peek, nextPeek } = store
    const peekUrl = (peek && peek.url) || (nextPeek && nextPeek.url)
    // console.log('peekUrl', !!peekUrl, 'loaded?', store.pageLoaded)
    return (
      <UI.Theme name="light">
        <peek
          $peekVisible={peek && !store.nextPeek}
          $peekPosition={[store.lastPeek, store.peek]}
          onMouseEnter={store.handlePeekEnter}
          onMouseLeave={store.handlePeekLeave}
        >
          <content $$draggable>
            <thingView if={store.thing}>
              <UI.Theme name="dark">
                <UI.Surface padding={20} flex background="#222">
                  <UI.Title selectable size={2} fontWeight={600}>
                    {store.thing.title}
                  </UI.Title>
                  <UI.Text selectable size={1.2}>
                    <div
                      className="html-content"
                      $$flex
                      dangerouslySetInnerHTML={{
                        __html: marked(store.thing.body),
                      }}
                    />
                  </UI.Text>
                </UI.Surface>
              </UI.Theme>
            </thingView>
            <WebView
              if={peekUrl}
              $contentLoading={!store.pageLoaded}
              $webview
              $visible={store.pageLoaded}
              key={peekUrl}
              src={peekUrl}
              getRef={store.handlePageRef}
            />
            <loading if={!store.pageLoaded}>
              <UI.Text>Loading</UI.Text>
            </loading>
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
      transition: 'opacity ease-in 100ms',
      opacity: 0,
    },
    peekVisible: {
      pointerEvents: 'all !important',
      opacity: 1,
      transition: 'opacity ease-out 100ms',
    },
    peekPosition: ([lastPeek, peek]) => ({
      transform: {
        y: peek
          ? peek.offsetTop
          : ((lastPeek && lastPeek.offsetTop) || 10) - 10,
      },
    }),
    content: {
      flex: 1,
      background: [0, 0, 0, 0.3],
      opacity: 1,
      transition: 'background ease-in 200ms',
      boxShadow: [[0, 0, 20, [0, 0, 0, 0.2]]],
      overflowX: 'hidden',
      overflowY: 'scroll',
    },
    contentLoading: {
      opacity: 0.3,
    },
    webview: {
      height: '100%',
      width: '100%',
      opacity: 0,
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
