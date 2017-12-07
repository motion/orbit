import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OS } from '~/helpers'

@view({
  store: class PeekStore {
    current = null
    peek = null

    willMount() {
      OS.send('peek-start')
      this.on(OS, 'peek-to', (event, peek) => {
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
        <peek>
          <welcome if={!peek}>
            <UI.Text size={3}>Welcome to peek</UI.Text>
          </welcome>

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
