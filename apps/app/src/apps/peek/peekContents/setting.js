import * as React from 'react'
import { view } from '@mcro/black'
import { App } from '@mcro/all'
import { Setting, Bit } from '@mcro/models'
import PeekHeader from '../peekHeader'
import { capitalize } from 'lodash'

@view({
  store: class SettingStore {
    setting = null
    bitsCount = null

    get selectedItem() {
      return App.state.selectedItem
    }

    async willMount() {
      this.setInterval(this.update, 1000)
      this.update()
    }

    update = async () => {
      const { type, integration } = this.selectedItem
      console.log('this.selectedItem', this.selectedItem)
      this.setting = await Setting.findOne({ type })
      this.bitsCount = await Bit.createQueryBuilder()
        .where({ integration, type })
        .getCount()
    }
  },
})
export class SettingView {
  render({ store }) {
    return (
      <React.Fragment>
        <PeekHeader title={capitalize(store.selectedItem.integration)} />
        <body>
          bits: {store.bitsCount}
          setting: {JSON.stringify(store.setting)}
          selectedItem: {JSON.stringify(App.state.selectedItem)}
          <input
            onSubmit={e => {
              store.setting.values.folders = [e.target.value]
              store.setting.save()
            }}
          />
        </body>
      </React.Fragment>
    )
  }

  static style = {
    body: {
      padding: 20,
      overflowY: 'scroll',
      flex: 1,
    },
  }
}
