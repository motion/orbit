import * as React from 'react'
import { Row, View, Text, SegmentedRow } from '@mcro/ui'
import { ManageSmartSync } from './ManageSmartSync'
import { Setting, SettingForceSyncCommand, SettingRemoveCommand } from '@mcro/models'
import { command } from '@mcro/model-bridge'
import { view } from '@mcro/black'
import { WhitelistManager } from '../helpers/WhitelistManager'
import { showConfirmDialog } from '../../helpers/electron/showConfirmDialog'
import { AppInfoStore } from '../../stores/AppInfoStore'
import { Actions } from '../../actions/Actions'
import { SyncStatus } from '../../pages/OrbitPage/orbitDocked/views/SyncStatus'
import { TitleBarSpace } from './layout/TitleBarSpace'
import { TitleBarButton } from './layout/TitleBarButton'
import { AppsStore } from '../../stores/AppsStore'

@view.attach('appsStore', 'appInfoStore')
export class SettingManageRow extends React.Component<{
  appsStore?: AppsStore
  appInfoStore?: AppInfoStore
  setting: Setting
  whitelist: WhitelistManager<any>
}> {
  handleRefresh = async () => {
    command(SettingForceSyncCommand, {
      settingId: this.props.setting.id,
    })
  }

  removeIntegration = async () => {
    if (
      showConfirmDialog({
        title: 'Remove integration?',
        message: `Are you sure you want to remove ${
          this.props.appsStore.getAppFromSetting(this.props.setting).display.name
        }?`,
      })
    ) {
      command(SettingRemoveCommand, {
        settingId: this.props.setting.id,
      })
      Actions.clearPeek()
    }
  }

  render() {
    const { setting, appInfoStore, whitelist } = this.props
    return (
      <Row padding={[6, 15]} alignItems="center" background="#eee">
        {!!whitelist ? <ManageSmartSync whitelist={whitelist} /> : <Text>Sync active.</Text>}
        <View flex={1} />
        <SyncStatus settingId={setting.id}>
          {(syncJobs, removeJobs) => {
            return (
              <>
                {(syncJobs.length || removeJobs.length) && (
                  <>
                    <Text size={0.9} fontWeight={400} alpha={0.6}>
                      {syncJobs.length ? 'Syncing...' : removeJobs.length ? 'Removing...' : name}
                    </Text>
                    <TitleBarSpace />
                  </>
                )}
                <Text size={0.9} fontWeight={400} alpha={0.6}>
                  {(+(appInfoStore.bitsCount || 0)).toLocaleString()} total
                </Text>
                <TitleBarSpace />
                <SegmentedRow>
                  <TitleBarButton
                    disabled={removeJobs.length > 0 || syncJobs.length > 0}
                    icon="remove"
                    tooltip="Remove integration"
                    onClick={this.removeIntegration}
                  />
                  <TitleBarButton
                    disabled={removeJobs.length > 0 || syncJobs.length > 0}
                    tooltip="Sync"
                    icon="refresh"
                    onClick={this.handleRefresh}
                  />
                </SegmentedRow>
              </>
            )
          }}
        </SyncStatus>
      </Row>
    )
  }
}
