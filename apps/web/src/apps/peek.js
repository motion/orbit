import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OS } from '~/helpers'

@view({
  store: class PeekStore {
    current = null

    willMount() {
      OS.send('peek-start')
      this.on(OS, 'peek-to', (...args) => {
        console.log(args)
      })
    }
  },
})
export default class PeekPage {
  render() {
    return (
      <UI.Theme name="light">
        <peek>
          <UI.Text size={3}>Hello</UI.Text>
        </peek>
      </UI.Theme>
    )
  }

  static style = {
    peek: {
      width: '100%',
      height: '100%',
      background: 'blue',
      alignItems: 'center',
    },
  }
}
