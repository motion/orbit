import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { Thing, CurrentUser } from '~/app'

@view({
  store: class PinPaneStore {
    pinThings = Thing.find().where({ type: 'pin' })
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
          <UI.List
            items={store.pinThings || []}
            getItem={thing => ({
              primary: thing.title,
              secondary: thing.url,
              content: thing.body,
            })}
          />

          {JSON.stringify(store.setting || null)}
        </content>
      </pane>
    )
  }

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
