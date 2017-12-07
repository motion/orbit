// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OS } from '~/helpers'

type Peek = {
  url?: string,
  offsetTop?: number,
  id?: number,
}

@view({
  store: class PeekStore {
    current = null
    peek: ?Peek = null

    willMount() {
      OS.send('peek-start')
      this.on(OS, 'peek-to', (event, peek: ?Peek) => {
        console.log('peek', peek)
        this.peek = peek
      })
    }
  },
})
export default class PeekPage {
  render({ store }) {
    const { peek } = store
    return (
      <UI.Theme name="light">
        <peek if={peek}>
          <content $$flex if={peek}>
            <iframe $$flex if={peek.url} src={peek.url} />
          </content>
        </peek>
      </UI.Theme>
    )
  }

  static style = {
    peek: {
      width: '100%',
      height: '100%',
      background: '#fff',
    },
    iframe: {
      border: 'none',
      borderWidth: 0,
      width: '100%',
    },
  }
}
