import * as React from 'react'
import { view } from '@mcro/black'
import { App } from '@mcro/stores'
import { Job, Setting as SettingModel } from '@mcro/models'
import { capitalize } from 'lodash'
import * as UI from '@mcro/ui'
import * as SettingPanes from './settingPanes'
import { SettingInfoStore } from '../../../stores/SettingInfoStore'
import { TimeAgo } from '../../../views/TimeAgo'
import { modelQueryReaction } from '@mcro/helpers'
import { PeekContentProps } from './PeekContentProps'
import { IntegrationSettingsStore } from '../../../stores/IntegrationSettingsStore'

const EmptyPane = ({ setting }) => (
  <div>no setting {JSON.stringify(setting)} pane</div>
)

const statusIcons = {
  PENDING: { name: 'check', color: '#999' },
  FAILED: { name: 'remove', color: 'darkred' },
  PROCESSING: { name: 'sport_user-run', color: 'darkblue' },
  COMPLETE: { name: 'check', color: 'darkgreen' },
}

@view.attach('integrationSettingsStore')
@view.attach({
  store: SettingInfoStore,
})
@view
export class SettingContent extends React.Component<
  PeekContentProps & {
    store?: SettingInfoStore
    integrationSettingsStore?: IntegrationSettingsStore
    setting: Setting
  }
> {
  handleRefresh = async () => {
    const store = this.props.store
    const job = new Job()
    job.type = store.setting.type
    job.action = 'all'
    job.status = Job.statuses.PENDING
    await job.save()
    store.update = Math.random()
  }

  removeIntegration = async () => {
    const { store } = this.props
    await store.setting.remove()
    App.actions.clearPeek()
  }

  render() {
    const { appStore, integrationSettingsStore, store, children } = this.props
    const { setting } = store
    if (!setting) {
      return children({})
    }
    const integration = setting.type
    const SettingPane =
      SettingPanes[`${capitalize(integration)}Setting`] || EmptyPane
    return (
      <SettingPane
        integrationSettingsStore={integrationSettingsStore}
        appStore={appStore}
        setting={setting}
        update={store.update}
      >
        {({ subhead, content }) => {
          // this is a bit strange, its calling up a few times and passing up props
          // not sure i like the pattern, but it is extremely flexible
          // basically look at PeekPageInner > setting > *Setting
          // where they call back up and pass contents *Setting() => setting() => PeekPageInner
          return children({
            title: capitalize(integration),
            subhead,
            content,
            subtitle: (
              <UI.Row if={store.job} flex={1}>
                <UI.Text>{store.bitsCount} total </UI.Text>
                <UI.View flex={1} />
                <UI.Text if={store.job.updatedAt}>
                  Last run:{' '}
                  <UI.Icon
                    size={14}
                    css={{ display: 'inline-block' }}
                    {...statusIcons[store.job.status]}
                  />{' '}
                  <TimeAgo postfix="ago">{store.job.updatedAt}</TimeAgo>
                </UI.Text>
                {!store.job && <div>Loading...</div>}
              </UI.Row>
            ),
            after: (
              <UI.ListRow
                flex={1}
                margin={[0, -8, -5, 0]}
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
              </UI.ListRow>
            ),
          })
        }}
      </SettingPane>
    )
  }
}

class LoadSettingStore {
  get setting() {
    return this.idSetting || this.typeSetting
  }

  get item() {
    return App.peekState.item || {}
  }

  idSetting = modelQueryReaction(() =>
    SettingModel.findOne({ id: this.item.id }),
  )

  // hackkkkky for now because look at OrbitSettings.generalsettings
  // need a migration to insert the settings first and then make them just like integrationSettingsd
  typeSetting = modelQueryReaction(() =>
    SettingModel.findOne({ type: this.item.id }),
  )
}

@view.attach({
  store: LoadSettingStore,
})
@view
export class Setting extends React.Component<
  PeekContentProps & {
    store: LoadSettingStore
  }
> {
  render() {
    const { store, ...props } = this.props
    if (!store.setting) {
      return null
    }
    return <SettingContent setting={store.setting} {...props} />
  }
}
