import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { Thing, CurrentUser } from '~/app'

@view({
  store: class PinPaneStore {
    crawlThings = Thing.find().where({ type: 'pin-site' })

    get setting() {
      return CurrentUser.setting.pins
    }
  },
})
export default class PinPane {
  render({ store }) {
    if (!store.setting) {
      console.log('no setting')
      return null
    }
    return (
      <pane>
        <content>
          <UI.Title size={2}>Pinned Sites</UI.Title>
          <UI.Title
            if={!store.crawlThings || !store.crawlThings.length}
            size={1.5}
          >
            No pinned sites!
          </UI.Title>
          <UI.List
            if={store.crawlThings}
            virtualized
            items={store.crawlThings}
            getItem={this.getItem}
          />
        </content>
      </pane>
    )
  }

  getItem = thing => ({
    primary: thing.title,
    secondary: thing.url,
    content: thing.body,
    after: <UI.Button onClick={() => thing.remove()}>Delete</UI.Button>,
  })

  static style = {
    pane: {
      padding: 10,
      flex: 1,
    },
    content: {
      flex: 1,
      overflowY: 'scroll',
    },
  }
}
