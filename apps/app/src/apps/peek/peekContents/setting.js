import * as React from 'react'
import { view } from '@mcro/black'
import { App } from '@mcro/stores'
import { Job } from '@mcro/models'
import { PeekHeader } from '../peekHeader'
import { capitalize } from 'lodash'
import * as UI from '@mcro/ui'
import * as SettingPanes from './settingPanes'
import { SettingInfoStore } from '~/stores/SettingInfoStore'
import { TimeAgo } from '~/views/TimeAgo'
// import * as _ from 'lodash'

const EmptyPane = ({ setting }) => (
  <div>no setting {JSON.stringify(setting)} pane</div>
)
const statusIcons = {
  PENDING: { name: 'check', color: '#999' },
  FAILED: { name: 'remove', color: 'darkred' },
  PROCESSING: { name: 'sport_user-run', color: 'darkblue' },
  COMPLETE: { name: 'check', color: 'darkgreen' },
}

@view({
  store: SettingInfoStore,
})
export class Setting extends React.Component {
  componentDidMount() {
    this.props.store.setBit(App.peekState.bit)
  }

  handleRefresh = async () => {
    const store = this.props.store
    const job = new Job()
    job.type = store.bit.integration
    job.action = 'all'
    job.status = Job.statuses.PENDING
    await job.save()
    store.update()
  }

  removeIntegration = async () => {
    const { store } = this.props
    store.setting.values = {}
    store.setting.token = ''
    await store.setting.save()
    store.update()
  }

  render({ appStore, store }) {
    if (!store.setting || !store.setting.token) {
      return null
    }
    store.version
    const { setting, bit } = store
    const { integration } = bit
    const SettingPane =
      SettingPanes[`${capitalize(integration)}Setting`] || EmptyPane
    return (
      <>
        <PeekHeader
          title={capitalize(integration)}
          subtitle={
            <div $$row>
              <jobStatus $$row if={store.job}>
                {store.bitsCount} total{' '}
                <UI.Text if={store.job.updatedAt}>
                  &nbsp;&middot; Last run:{' '}
                  <UI.Icon
                    size={14}
                    css={{ display: 'inline-block' }}
                    {...statusIcons[store.job.status]}
                  />{' '}
                  <TimeAgo postfix="ago">{store.job.updatedAt}</TimeAgo>
                </UI.Text>
              </jobStatus>
              <load if={!store.job}>Loading...</load>
            </div>
          }
          after={
            <UI.Row
              $$flex
              css={{ margin: [0, -8, -5, 0] }}
              itemProps={{
                size: 0.9,
                chromeless: true,
                opacity: 0.7,
                margin: [0, 0, 0, 5],
              }}
            >
              <UI.Button
                icon="refresh"
                tooltip="Refresh"
                onClick={this.handleRefresh}
              />
              <UI.Button
                icon="remove"
                tooltip="Remove"
                onClick={this.removeIntegration}
              />
            </UI.Row>
          }
        />
        <body>
          <SettingPane
            appStore={appStore}
            setting={setting}
            update={store.update}
          />
        </body>
      </>
    )
  }

  static style = {
    body: {
      overflow: 'hidden',
      flex: 1,
    },
  }
}
