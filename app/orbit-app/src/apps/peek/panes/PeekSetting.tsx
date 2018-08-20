import * as React from 'react'
import { view } from '@mcro/black'
import { App } from '@mcro/stores'
import { Setting } from '@mcro/models'
import { capitalize } from 'lodash'
import * as UI from '@mcro/ui'
import { SettingRepository } from '../../../repositories'
import * as SettingPanes from './settingPanes'
import { SettingInfoStore } from '../../../stores/SettingInfoStore'
import { TimeAgo } from '../../../views/TimeAgo'
import { PeekPaneProps } from '../PeekPaneProps'
import { IntegrationSettingsStore } from '../../../stores/IntegrationSettingsStore'
import { RoundButton } from '../../../views'

// @ts-ignore
const Electron = electronRequire('electron')

const EmptyPane = ({ setting }) => (
  <div>no setting {JSON.stringify(setting)} pane</div>
)

const statusIcons = {
  PENDING: { name: 'check', color: '#999' },
  FAILED: { name: 'remove', color: 'darkred' },
  PROCESSING: { name: 'sport_user-run', color: 'darkblue' },
  COMPLETE: { name: 'check', color: 'darkgreen' },
}

const SubTitleButton = props => (
  <UI.Button sizeHeight={0.85} sizePadding={0.9} {...props} />
)

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
    // const store = this.props.store
    // const job: Job = {} as Job
    // job.type = store.setting.type
    // job.status = 'PENDING'
    // await JobRepository.save(job)
  }

  removeIntegration = async () => {
    const { store } = this.props
    const response = Electron.remote.dialog.showMessageBox({
      type: 'question',
      title: 'Remove integration?',
      message: `Are you sure you want to remove ${store.setting.type}`,
      buttons: ['Cancel', 'Ok'],
      defaultId: 1,
      cancelId: 0,
    })
    if (response === 1) {
      await SettingRepository.remove(store.setting)
      App.actions.clearPeek()
    }
  }

  render() {
    const {
      appStore,
      integrationSettingsStore,
      model,
      store,
      children,
    } = this.props
    const setting = model as Setting
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
        {({ belowHead, content }) => {
          // this is a bit strange, its calling up a few times and passing up props
          // not sure i like the pattern, but it is extremely flexible
          // basically look at PeekPageInner > setting > *Setting
          // where they call back up and pass contents *Setting() => setting() => PeekPageInner
          const icon = statusIcons[store.job && store.job.status] || {}
          return children({
            title: capitalize(integration),
            subtitleBefore: (
              <SubTitleButton
                icon="remove"
                tooltip="Remove integration"
                onClick={this.removeIntegration}
              >
                Remove
              </SubTitleButton>
            ),
            subtitle: (
              <>
                <UI.Text>{store.bitsCount} total</UI.Text>
                <UI.View width={10} />
                {!!store.job &&
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
                  )}
              </>
            ),
            subtitleAfter: (
              <SubTitleButton
                tooltip="Re-run sync"
                onClick={this.handleRefresh}
              >
                Sync
              </SubTitleButton>
            ),
            belowHead,
            content,
          })
        }}
      </SettingPane>
    )
  }
}

@view
export class PeekSetting extends React.Component<PeekPaneProps> {
  render() {
    const { peekStore, ...props } = this.props
    const { model } = peekStore.state
    if (!model) {
      return (
        <div style={{ background: 'red', width: '100%', height: '100%' }}>
          helllo
        </div>
      )
    }
    return <SettingContent setting={model} peekStore={peekStore} {...props} />
  }
}
