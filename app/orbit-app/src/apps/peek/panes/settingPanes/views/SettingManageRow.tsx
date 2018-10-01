import * as React from 'react'
import { Row, View, Text, SegmentedRow } from '@mcro/ui'
import { ManageSmartSync } from './ManageSmartSync'
import { SyncStatus } from '../../../../orbit/orbitDocked/views/SyncStatus'
import { TitleBarSpace } from '../../../views/TitleBarSpace'
import { TitleBarButton } from '../../../views/TitleBarButton'
import { Setting, SettingForceSyncCommand, SettingRemoveCommand } from '@mcro/models'
import { command } from '@mcro/model-bridge'
import { showConfirmDialog } from '../../../../../helpers/electron/showConfirmDialog'
import { NICE_INTEGRATION_NAMES } from '../../../../../constants'
import { Actions } from '../../../../../actions/Actions'
import { view } from '@mcro/black'
import { AppInfoStore } from '../../../../../stores/AppInfoStore'
import { WhitelistManager } from '../stores/WhitelistManager'

@view.attach('appInfoStore')
export class SettingManageRow extends React.Component<{
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
          NICE_INTEGRATION_NAMES[this.props.setting.type]
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
      <Row padding={[6, 15]} alignItems="center">
        <ManageSmartSync whitelist={whitelist} />
        <View flex={1} />
        <SyncStatus settingId={setting.id}>
          {jobs => {
            return (
              <>
                {jobs && (
                  <>
                    <Text size={0.9} fontWeight={400} alpha={0.6}>
                      Syncing...
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
                </SegmentedRow>
              </>
            )
          }}
        </SyncStatus>
      </Row>
    )
  }
}
