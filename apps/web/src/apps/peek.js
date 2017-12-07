// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OS } from '~/helpers'
import { debounce } from 'lodash'

const isSamePeek = (a, b) => a && b && a.url === b.url
const ANIMATION_TIME = 500

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
      this.on(OS, 'peek-to', (event, peek: ?Peek) => {
        if (peek && !isSamePeek(this.lastPeek, peek)) {
          this.pendingPeek = peek
        }
        this.updatePeek(peek)
      })
    }

    updatePeek = debounce((peek: Peek) => {
      console.log('setting peek', peek)
      this.currentPeek = peek
      if (peek) {
        this.lastPeek = peek
      }
      this.clearPendingPeek()
    }, ANIMATION_TIME - 100)

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
  },
})
export default class PeekPage {
  render({ store }) {
    const { peek } = store
    console.log('render peek', peek, store)
    return (
      <UI.Theme name="light">
        <peek
          $peekVisible={peek && !store.pendingPeek}
          onMouseEnter={store.handlePeekEnter}
          onMouseLeave={store.handlePeekLeave}
        >
          <content $$flex>
            <webview if={peek && peek.url} src={peek.url} />
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
    webview: {
      height: '100%',
      width: '100%',
    },
    iframe: {
      border: 'none',
      borderWidth: 0,
      width: '100%',
    },
  }
}
