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

export class SettingManageRow extends React.Component<{ store: any; setting: Setting }> {
  handleRefresh = async () => {
    command(SettingForceSyncCommand, {
      settingId: this.props.setting.id,
    })
  }

  removeIntegration = async () => {
    const { store } = this.props
    if (
      showConfirmDialog({
        title: 'Remove integration?',
        message: `Are you sure you want to remove ${NICE_INTEGRATION_NAMES[store.setting.id]}?`,
      })
    ) {
      console.log('removing', store.setting.id)
      command(SettingRemoveCommand, {
        settingId: store.setting.id,
      })
      Actions.clearPeek()
    }
  }

  render() {
    const { store, setting } = this.props
    return (
      <Row padding={[6, 15]}>
        <ManageSmartSync whitelist={store.whitelist} />
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
                  {(+store.bitsCount).toLocaleString()} total
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
