// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OS } from '~/helpers'

const isSamePeek = (a, b) => a && b && a.url === b.url
const SHOW_DELAY = 200
const HIDE_DELAY = 40

type Peek = {
  url?: string,
  offsetTop?: number,
  id?: number,
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
        if (peek && !isSamePeek(this.lastPeek, peek)) {
          this.pendingPeek = peek
        }
        clearTimeout(peekTimeout)
        const update = () => this.updatePeek(peek)
        peekTimeout = this.setTimeout(update, !peek ? HIDE_DELAY : SHOW_DELAY)
      })
    }

    updatePeek = (peek: Peek) => {
      console.log('setting peek', peek)
      this.pageLoaded = false
      this.currentPeek = peek
      if (peek) {
        this.lastPeek = peek
      }
      this.clearPendingPeek()
    }

    handlePeekEnter = () => {
      this.isHovered = true
    }

    handlePeekLeave = () => {
      this.isHovered = false
      if (!this.currentPeek) {
        this.lastPeek = null
        this.clearPendingPeek()
      }
    }

    clearPendingPeek() {
      this.pendingPeek = null
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
      const offFinishLoad = this.on(ref, 'did-finish-load', loadPage)
      console.log('offFinishLoad', offFinishLoad)
      // after a second just load anyway
      const offTimeoutLoad = this.setTimeout(loadPage, 1000)
      this.offLoad = () => {
        offFinishLoad.dispose()
        clearTimeout(offTimeoutLoad)
      }
    }
  },
})
export default class PeekPage {
  render({ store }) {
    const { peek } = store
    console.log('render peek', peek, store)
    const hasContent = peek && peek.url
    return (
      <UI.Theme name="light">
        <peek
          $peekVisible={peek && !store.pendingPeek}
          onMouseEnter={store.handlePeekEnter}
          onMouseLeave={store.handlePeekLeave}
        >
          <content $$flex $contentLoading={!store.pageLoaded}>
            <webview
              if={hasContent}
              ref={store.handlePageRef}
              $visible={store.pageLoaded}
              src={peek.url}
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
      height: '100%',
      padding: 20,
      pointerEvents: 'none !important',
      opacity: 0,
      // background: 'red',
      transform: {
        y: -10,
      },
      transition: 'transform ease-in 100ms, opacity ease-in 100ms',
    },
    peekVisible: {
      pointerEvents: 'all !important',
      opacity: 1,
      transform: {
        y: 0,
      },
    },
    content: {
      background: '#fff',
      boxShadow: [[0, 0, 20, [0, 0, 0, 0.2]]],
      // borderRadius: 10,
      overflow: 'hidden',
    },
    contentLoading: {
      background: [0, 0, 0, 0.1],
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
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
  }
}
