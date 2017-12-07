// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OS } from '~/helpers'
import { debounce } from 'lodash'

type Peek = {
  url?: string,
  offsetTop?: number,
  id?: number,
}

@view({
  store: class PeekStore {
    lastPeek: ?Peek = null
    currentPeek: ?Peek = null
    hoveringPeek = false
    updatingPeek = false

    get peek() {
      if (this.hoveringPeek) {
        return this.lastPeek
      }
      return this.currentPeek
    }

    willMount() {
      OS.send('peek-start')
      this.on(OS, 'peek-to', (event, peek: ?Peek) => {
        if (peek && this.peek && peek.url !== this.lastPeek.url) {
          this.updatingPeek = true
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
      this.updatingPeek = false
    }, 500)

    handlePeekEnter = () => {
      this.hoveringPeek = true
    }

    handlePeekLeave = () => {
      this.hoveringPeek = false
      if (!this.currentPeek) {
        this.lastPeek = null
      }
    }
  },
})
export default class PeekPage {
  render({ store }) {
    const { peek } = store
    return (
      <UI.Theme name="light">
        <peek
          $peekVisible={peek && !store.updatingPeek}
          onMouseEnter={store.handlePeekEnter}
          onMouseLeave={store.handlePeekLeave}
        >
          <content $$flex if={peek}>
            <webview if={peek.url} src={peek.url} />
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
      pointerEvents: 'none',
      opacity: 0,
      transform: {
        y: -10,
      },
      transition: 'all ease-in 100ms',
    },
    peekVisible: {
      pointerEvents: 'all',
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
