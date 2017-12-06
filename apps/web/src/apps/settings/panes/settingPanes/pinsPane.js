import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { Thing, CurrentUser } from '~/app'

@view({
  store: class CrawlerPaneStore {
    things = Thing.find().where({ type: 'pin-site' })

    get setting() {
      return CurrentUser.setting.pins
    }
  },
})
export default class CrawlerPane {
  render({ store }) {
    if (!CurrentUser.setting) {
      console.log('no user setting')
      return null
    }
    return (
      <pane>
        <content>
          <UI.List
            items={store.things || []}
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
