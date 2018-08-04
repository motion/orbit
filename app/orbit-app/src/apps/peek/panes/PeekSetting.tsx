import * as React from 'react'
import { view } from '@mcro/black'
import { App } from '@mcro/stores'
import { Job, Setting } from '@mcro/models'
import { capitalize } from 'lodash'
import * as UI from '@mcro/ui'
import { JobRepository, SettingRepository } from '../../../repositories'
import * as SettingPanes from './settingPanes'
import { SettingInfoStore } from '../../../stores/SettingInfoStore'
import { TimeAgo } from '../../../views/TimeAgo'
import { modelQueryReaction } from '@mcro/helpers'
import { PeekPaneProps } from '../PeekPaneProps'
import { IntegrationSettingsStore } from '../../../stores/IntegrationSettingsStore'
import { RoundButton } from '../../../views'

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
class SettingContent extends React.Component<
  PeekPaneProps & {
    store?: SettingInfoStore
    integrationSettingsStore?: IntegrationSettingsStore
    setting: Setting
  }
> {
  handleRefresh = async () => {
    const store = this.props.store
    const job: Job = {} as Job
    job.type = store.setting.type
    job.action = 'all'
    job.status = 'PENDING'
    await JobRepository.save(setting)
  }

  removeIntegration = async () => {
    const { store } = this.props
    await SettingRepository.remove(store.setting)
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
      >
        {({ subhead, content }) => {
          // this is a bit strange, its calling up a few times and passing up props
          // not sure i like the pattern, but it is extremely flexible
          // basically look at PeekPageInner > setting > *Setting
          // where they call back up and pass contents *Setting() => setting() => PeekPageInner
          const icon = statusIcons[store.job && store.job.status] || {}
          return children({
            title: capitalize(integration),
            subhead,
            content,
            subtitleBefore: <UI.Text>{store.bitsCount} total</UI.Text>,
            subtitle: !store.job ? 'Loading...' : '',
            subtitleAfter: !!store.job &&
              !!store.job.updatedAt && (
                <RoundButton
                  icon={icon.name}
                  iconProps={icon}
                  tooltip={
                    <TimeAgo postfix="ago">{store.job.updatedAt}</TimeAgo>
                  }
                >
                  Last run
                </RoundButton>
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

class PeekSettingStore {
  props: PeekPaneProps

  get setting() {
    return this.idSetting || this.typeSetting
  }

  get item() {
    return this.props.item
  }

  idSetting = modelQueryReaction(() =>
    SettingRepository.findOne({ id: this.item.id }),
  )

  // hackkkkky for now because look at OrbitSettings.generalsettings
  // need a migration to insert the settings first and then make them just like integrationSettingsd
  typeSetting = modelQueryReaction(() =>
    SettingRepository.findOne({ type: this.item.id }),
  )
}

@view.attach({
  store: PeekSettingStore,
})
@view
export class PeekSetting extends React.Component<
  PeekPaneProps & {
    store: PeekSettingStore
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
