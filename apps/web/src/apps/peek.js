// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OS } from '~/helpers'

const isSamePeek = (a, b) => a && b && a.url === b.url
const SHOW_DELAY = 200
const HIDE_DELAY = 40

window.Event = Event

type Peek = {
  url?: string,
  offsetTop?: number,
  id?: number,
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
    currentPeek: ?Peek = null
    pendingPeek: ?Peek = null
    isHovered = false
    pageLoaded = false

    get peek() {
      if (
        this.pendingPeek &&
        this.currentPeek &&
        !isSamePeek(this.pendingPeek, this.currentPeek)
      ) {
        return null
      }
      if (this.isHovered) {
        return this.lastPeek
      }
      return this.currentPeek
    }

    willMount() {
      OS.send('peek-start')

      let peekTimeout
      this.on(OS, 'peek-to', (event, peek: ?Peek) => {
        console.log('peek-to', peek, this.lastPeek)
        const isSame = isSamePeek(this.lastPeek, peek)
        const update = () => this.updatePeek(peek)
        if (isSame) {
          update()
          return
        }
        if (peek) {
          this.pendingPeek = peek
        }
        clearTimeout(peekTimeout)
        peekTimeout = this.setTimeout(update, !peek ? HIDE_DELAY : SHOW_DELAY)
      })
    }

    updatePeek = (peek: Peek) => {
      this.currentPeek = peek
      if (peek) {
        this.lastPeek = peek
      }
      this.pendingPeek = null
    }

    handlePeekEnter = () => {
      this.isHovered = true
    }

    handlePeekLeave = () => {
      // timeout here prevent flicker on re-enter same item
      this.setTimeout(() => {
        this.isHovered = false
        if (!this.currentPeek) {
          this.pendingPeek = null
        }
      }, 100)
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
      console.log('handling ref', ref)
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
    const { peek } = store
    const peekUrl = peek && peek.url
    return (
      <UI.Theme name="light">
        <peek
          $peekVisible={peek && !store.pendingPeek}
          $peekPosition={[store.lastPeek, store.peek]}
          onMouseEnter={store.handlePeekEnter}
          onMouseLeave={store.handlePeekLeave}
        >
          <content $$draggable $$flex $contentLoading={!store.pageLoaded}>
            <WebView
              if={peekUrl}
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
      transition: 'transform ease-in 100ms, opacity ease-in 100ms',
      opacity: 0,
    },
    peekVisible: {
      pointerEvents: 'all !important',
      opacity: 1,
      transition: 'opacity ease-out 1ms, transform ease-out 100ms',
    },
    peekPosition: ([lastPeek, peek]) => ({
      transform: {
        y: peek
          ? peek.offsetTop
          : ((lastPeek && lastPeek.offsetTop) || 10) - 10,
      },
    }),
    content: {
      background: [0, 0, 0, 0.3],
      opacity: 1,
      transition: 'background ease-in 200ms',
      boxShadow: [[0, 0, 20, [0, 0, 0, 0.2]]],
      // borderRadius: 10,
      overflow: 'hidden',
    },
    contentLoading: {
      background: [0, 0, 0, 0.3],
      opacity: 0.3,
      transition: 'none',
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
