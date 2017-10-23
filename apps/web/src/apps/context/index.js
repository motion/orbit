import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser } from '~/app'
import PaneView from '~/apps/home/panes/pane'
import { OS } from '~/helpers'

@view({
  store: class ContextStore {
    url = null

    willMount() {
      OS.on('set-context', (event, url) => {
        console.log('got url', url)
        this.url = url
      })
      this.getUrl()
    }

    getUrl = () => {
      OS.send('get-context')
      setTimeout(this.getUrl, 500)
    }
  },
})
export default class Context {
  render({ store }) {
    return (
      <h5 css={{ padding: 30 }}>
        <UI.Theme name="dark">
          <button
            onClick={() => {
              console.log('getting context')
              OS.send('get-context')
            }}
          >
            get
          </button>
          <UI.Text>url is {store.url}</UI.Text>
          <PaneView
            stackItems={{
              results: { title: 'hello' },
            }}
          />
        </UI.Theme>
      </h5>
    )
  }

  static style = {}
}
