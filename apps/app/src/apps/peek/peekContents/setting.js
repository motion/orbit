import * as React from 'react'
import { view } from '@mcro/black'
import { App } from '@mcro/all'
import { Job } from '@mcro/models'
import { PeekHeader } from '../peekHeader'
import { capitalize } from 'lodash'
import * as UI from '@mcro/ui'
import * as SettingPanes from './settingPanes'
import { SettingInfoStore } from '~/stores/SettingInfoStore'

const EmptyPane = () => <div>no setting pane</div>

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
    job.action = 'mail'
    job.status = Job.statuses.PENDING
    await job.save()
    console.log('created new job', job)
    store.update()
    this.props.appStore.getSettings()
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
      console.log('no setting or token', store.setting)
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
                <UI.Text>&nbsp;| {store.job.status}</UI.Text>
                <UI.Text if={store.job.updatedAt}>
                  &nbsp;| <UI.Date>{store.job.updatedAt}</UI.Date>
                </UI.Text>
              </jobStatus>
              <load if={!store.job}>Loading...</load>
            </div>
          }
          after={
            <UI.Row $$flex $actions>
              <UI.Button
                icon="refresh"
                tooltip="Refresh"
                onClick={this.handleRefresh}
              />
              <UI.Popover
                openOnHover
                openOnClick
                target={<UI.Button icon="gear" />}
              >
                <UI.List background>
                  <UI.ListItem primary="hello2" />
                  <UI.ListItem primary="hello3" />
                  <UI.ListItem
                    primary="remove integration"
                    onClick={this.removeIntegration}
                  />
                </UI.List>
              </UI.Popover>
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
      padding: 20,
      flex: 1,
    },
    actions: { opacity: 0.2 },
  }
}
