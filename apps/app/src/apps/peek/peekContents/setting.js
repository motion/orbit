import * as React from 'react'
import { view } from '@mcro/black'
import { App } from '@mcro/all'
import { Setting, Bit, Job } from '@mcro/models'
import PeekHeader from '../peekHeader'
import { capitalize, throttle } from 'lodash'
import * as UI from '@mcro/ui'

@view({
  store: class SettingStore {
    setting = null
    settingVersion = 0
    job = null
    bitsCount = null

    get selectedItem() {
      return App.state.selectedItem
    }

    async willMount() {
      this.setInterval(this.update, 1000)
      this.update()
    }

    update = async () => {
      const { integration } = this.selectedItem
      this.job = await Job.findOne({
        where: { type: integration },
        order: { createdAt: 'asc' },
      })
      this.setting = await Setting.findOne({ type: integration })
      this.bitsCount = await Bit.createQueryBuilder()
        .where({ integration })
        .getCount()
    }
  },
})
export class SettingView {
  render({ store }) {
    if (!store.setting) {
      return <div>no setting</div>
    }
    store.settingVersion
    const { setting } = store
    const { syncSettings = { max: 50 } } = setting.values
    const throttleSaveSetting = throttle(() => setting.save(), 500)
    return (
      <React.Fragment>
        <PeekHeader
          title={capitalize(store.selectedItem.integration)}
          subtitle={<div>Synced {store.bitsCount} total</div>}
          after={
            <div $$flex>
              <UI.Button
                icon="refresh"
                onClick={() => {
                  const job = new Job()
                  ;(job.type = store.selectedItem.integration),
                    (job.action = 'mail')
                  job.save()
                }}
              />
            </div>
          }
        />
        <body>
          <status if={store.job}>
            <UI.Title>Last Sync</UI.Title>
            <UI.Text>Status: {store.job.status}</UI.Text>
            <UI.Text>
              At: <UI.Date>{store.job.updatedAt}</UI.Date>
            </UI.Text>
          </status>
          <setting>
            setting:
            <UI.Field
              row
              label="Max"
              value={syncSettings.max}
              onChange={e => {
                setting.values.syncSettings = {
                  ...syncSettings,
                  max: e.target.value,
                }
                store.settingVersion += 1
                throttleSaveSetting()
              }}
            />
            <pre>
              {JSON.stringify(store.setting.values.oauth || null, 0, 2)}
            </pre>
          </setting>
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
