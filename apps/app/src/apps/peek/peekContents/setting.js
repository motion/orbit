import * as React from 'react'
import { view } from '@mcro/black'
import { App } from '@mcro/all'
import { Bit, Job } from '@mcro/models'
import PeekHeader from '../peekHeader'
import PeekFrame from '../peekFrame'
import { capitalize, throttle } from 'lodash'
import * as UI from '@mcro/ui'
import * as SettingPanes from './settingPanes'

const EmptyPane = () => <div>no setting pane</div>

@view({
  store: class SettingStore {
    settingVersion = 0
    job = null
    bitsCount = null

    get setting() {
      return this.props.appStore.settings[this.selectedItem.integration]
    }

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
        order: { createdAt: 'DESC' },
      })
      this.bitsCount = await Bit.createQueryBuilder()
        .where({ integration })
        .getCount()
    }
  },
})
export class SettingView {
  render({ appStore, store }) {
    if (!store.setting || !store.setting.token) {
      console.log('no setting or token', store.setting)
      return null
    }
    store.settingVersion
    const { setting } = store
    const { syncSettings = { max: 50 } } = setting.values
    const throttleSaveSetting = throttle(() => setting.save(), 500)
    const SettingPane =
      SettingPanes[store.selectedItem.integration] || EmptyPane
    return (
      <PeekFrame>
        <PeekHeader
          title={capitalize(store.selectedItem.integration)}
          subtitle={
            <div $$row if={store.job}>
              {store.bitsCount} total{' '}
              <UI.Text>&nbsp;| {store.job.status}</UI.Text>
              <UI.Text>
                &nbsp;| <UI.Date>{store.job.updatedAt}</UI.Date>
              </UI.Text>
            </div>
          }
          after={
            <UI.Row $$flex>
              <UI.Button
                icon="refresh"
                onClick={async () => {
                  const job = new Job()
                  job.type = store.selectedItem.integration
                  job.action = 'mail'
                  job.status = Job.statuses.PENDING
                  await job.save()
                  console.log('created new job', job)
                  store.update()
                  appStore.getSettings()
                }}
              />
              <UI.Button
                icon="remove"
                onClick={async () => {
                  store.setting.values = {}
                  store.setting.token = ''
                  await store.setting.save()
                  store.update()
                }}
              />
            </UI.Row>
          }
        />
        <body>
          <status if={store.job} />
          <setting>
            <SettingPane appStore={appStore} />
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
      </PeekFrame>
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
