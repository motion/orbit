import * as React from 'react'
import { Row, View, Text, SegmentedRow } from '@mcro/ui'
import { ManageSmartSync } from './ManageSmartSync'
import { SourceForceSyncCommand, SourceRemoveCommand, Source } from '@mcro/models'
import { command } from '@mcro/model-bridge'
import { attach } from '@mcro/black'
import { WhitelistManager } from '../../helpers/WhitelistManager'
import { showConfirmDialog } from '../../../helpers/electron/showConfirmDialog'
import { AppInfoStore } from '../../../components/AppInfoStore'
import { AppActions } from '../../../actions/AppActions'
import { SyncStatus, useJobs } from '../../../hooks/useJobs'
import { TitleBarSpace } from '../layout/TitleBarSpace'
import { TitleBarButton } from '../layout/TitleBarButton'
import { getAppFromSource } from '../../../stores/SourcesStore'

@attach('appInfoStore')
export class SettingManageRow extends React.Component<{
  appInfoStore?: AppInfoStore
  source: Source
  whitelist: WhitelistManager<any>
}> {
  handleRefresh = async () => {
    command(SourceForceSyncCommand, {
      sourceId: this.props.source.id,
    })
  }

  removeIntegration = async () => {
    if (
      showConfirmDialog({
        title: 'Remove integration?',
        message: `Are you sure you want to remove ${
          getAppFromSource(this.props.source).display.name
        }?`,
      })
    ) {
      command(SourceRemoveCommand, {
        sourceId: this.props.source.id,
      })
      AppActions.clearPeek()
    }
  }

  render() {
    const { source, appInfoStore, whitelist } = this.props
    const { activeJobs, removeJobs } = useJobs(source.id)

    return (
      <Row padding={[6, 15]} alignItems="center">
        {!!whitelist ? <ManageSmartSync whitelist={whitelist} /> : <Text>Sync active.</Text>}
        <View flex={1} />
        {!!(activeJobs.length || removeJobs.length) && (
          <>
            <Text size={0.9} fontWeight={400} alpha={0.6}>
              {activeJobs.length ? 'Syncing...' : removeJobs.length ? 'Removing...' : name}
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
            disabled={removeJobs.length > 0 || activeJobs.length > 0}
            icon="remove"
            tooltip="Remove integration"
            onClick={this.removeIntegration}
          />
          <TitleBarButton
            disabled={removeJobs.length > 0 || activeJobs.length > 0}
            tooltip="Sync"
            icon="refresh"
            onClick={this.handleRefresh}
          />
        </SegmentedRow>
      </Row>
    )
  }
}
