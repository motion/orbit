import { view } from '@mcro/black'
import { Setting, SettingForceSyncCommand, SettingRemoveCommand } from '@mcro/models'
import * as UI from '@mcro/ui'
import { capitalize } from 'lodash'
import * as React from 'react'
import { Mediator } from '@mcro/model-bridge'
import { AppsStore } from '../../AppsStore'
import { AppInfoStore } from '../../../stores/AppInfoStore'
import { RoundButton } from '../../../views'
import { TimeAgo } from '../../../views/TimeAgo'
import { PeekPaneProps } from '../PeekPaneProps'
import * as SettingPanes from './settingPanes'
import { TitleBarButton } from '../views/TitleBarButton'
import { TitleBarSpace } from '../views/TitleBarSpace'
import { Actions } from '../../../actions/Actions'
import { showConfirmDialog } from '../../../helpers/electron/showConfirmDialog'
import { NICE_INTEGRATION_NAMES } from '../../../constants'
import { SyncStatus } from '../../orbit/orbitDocked/views/SyncStatus'

type Props = PeekPaneProps & {
  store?: AppInfoStore
  appsStore?: AppsStore
  setting: Setting
}

const EmptyPane = ({ setting }) => <div>no setting {JSON.stringify(setting)} pane</div>

const statusIcons = {
  PENDING: { name: 'check', color: '#999' },
  FAILED: { name: 'remove', color: 'darkred' },
  PROCESSING: { name: 'sport_user-run', color: 'darkblue' },
  COMPLETE: { name: 'check', color: 'darkgreen' },
}

@view.attach('appsStore')
@view.attach({
  store: AppInfoStore,
})
@view
class SettingContent extends React.Component<Props> {
  handleRefresh = async () => {
    Mediator.command(SettingForceSyncCommand, {
      settingId: this.props.setting.id,
    })
  }

  removeIntegration = async () => {
    const { store } = this.props
    if (
      showConfirmDialog({
        title: 'Remove integration?',
        message: `Are you sure you want to remove ${capitalize(
          NICE_INTEGRATION_NAMES[store.setting.id],
        )}?`,
      })
    ) {
      console.log('removing', store.setting.id)
      Mediator.command(SettingRemoveCommand, {
        settingId: store.setting.id,
      })
      Actions.clearPeek()
    }
  }

  render() {
    const { appsStore, model, store, children } = this.props
    const setting = model as Setting
    if (!setting) {
      return children({})
    }
    const integration = setting.type
    const SettingPane = SettingPanes[`${capitalize(integration)}Setting`] || EmptyPane
    return (
      <SettingPane appsStore={appsStore} setting={setting}>
        {({ belowHead, content }) => {
          // this is a bit strange, its calling up a few times and passing up props
          // not sure i like the pattern, but it is extremely flexible
          // basically look at PeekPageInner > setting > *Setting
          // where they call back up and pass contents *Setting() => setting() => PeekPageInner
          const icon = statusIcons[store.job && store.job.status] || {}
          return children({
            title: capitalize(integration),
            subtitle: (
              <>
                <UI.View width={10} />
                {!!store.job &&
                  !!store.job.updatedAt && (
                    <RoundButton
                      icon={icon.name}
                      iconProps={icon}
                      tooltip={<TimeAgo postfix="ago">{store.job.updatedAt}</TimeAgo>}
                    >
                      Last run
                    </RoundButton>
                  )}
              </>
            ),
            subtitleAfter: (
              <SyncStatus settingId={setting.id}>
                {jobs => {
                  return (
                    <>
                      {jobs && (
                        <>
                          <UI.Text size={0.9} fontWeight={400} alpha={0.6}>
                            Syncing...
                          </UI.Text>
                          <TitleBarSpace />
                        </>
                      )}
                      <UI.Text size={0.9} fontWeight={400} alpha={0.6}>
                        {(+store.bitsCount).toLocaleString()} total
                      </UI.Text>
                      <TitleBarSpace />
                      <UI.ListRow>
                        <TitleBarButton
                          icon="remove"
                          tooltip="Remove integration"
                          onClick={this.removeIntegration}
                        />
                        <TitleBarButton
                          disabled={!!jobs}
                          tooltip="Sync"
                          icon="refresh"
                          onClick={this.handleRefresh}
                        />
                      </UI.ListRow>
                    </>
                  )
                }}
              </SyncStatus>
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
      return null
    }
    return <SettingContent setting={model} peekStore={peekStore} {...props} />
  }
}
