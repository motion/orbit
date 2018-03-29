import * as React from 'react'
import { view } from '@mcro/black'
import { App } from '@mcro/all'
import { Setting } from '@mcro/models'
import PeekHeader from '../peekHeader'
import { capitalize } from 'lodash'

@view({
  store: class SettingStore {
    setting = null

    get type() {
      const { peekTarget } = App.state
      return peekTarget.id
    }

    async willMount() {
      this.setting = await Setting.findOne({ type: this.type })
    }
  },
})
export class SettingView {
  render({ store }) {
    return (
      <content>
        <PeekHeader title={capitalize(store.type)} />
        {JSON.stringify(store.setting)}
        <input
          onSubmit={e => {
            store.setting.values.folders = [e.target.value]
            store.setting.save()
          }}
        />
      </content>
    )
  }

  static style = {
    content: {
      padding: 20,
      overflowY: 'scroll',
      flex: 1,
    },
  }
}
