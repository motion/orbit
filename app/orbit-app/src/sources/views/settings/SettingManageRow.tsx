import * as React from 'react'
import { Row, View, Text, SegmentedRow } from '@mcro/ui'
import { ManageSmartSync } from './ManageSmartSync'
import {
  SourceForceSyncCommand,
  SourceRemoveCommand,
  Source,
  SourceForceCancelCommand,
} from '@mcro/models'
import { command } from '@mcro/model-bridge'
import { WhitelistManager } from '../../helpers/WhitelistManager'
import { showConfirmDialog } from '../../../helpers/electron/showConfirmDialog'
import { AppActions } from '../../../actions/AppActions'
import { useJobs } from '../../../hooks/useJobs'
import { TitleBarSpace } from '../layout/TitleBarSpace'
import { TitleBarButton } from '../layout/TitleBarButton'
import { getAppFromSource } from '../../../stores/SourcesStore'
import { useSourceInfo } from '../../../hooks/useSourceInfo'

const handleRefresh = async (sourceId: number) => {
  command(SourceForceSyncCommand, {
    sourceId,
  })
}

const removeIntegration = async (source: Source) => {
  if (
    showConfirmDialog({
      title: 'Remove integration?',
      message: `Are you sure you want to remove ${getAppFromSource(source).display.name}?`,
    })
  ) {
    command(SourceRemoveCommand, {
      sourceId: source.id,
    })
    AppActions.clearPeek()
  }
}

export const SettingManageRow = (props: { source: Source; whitelist: WhitelistManager<any> }) => {
  const { bitsCount } = useSourceInfo(props.source.id)
  const { activeJobs, removeJobs } = useJobs(props.source.id)

  return (
    <Row padding={[6, 15]} alignItems="center">
      {!!props.whitelist ? (
        <ManageSmartSync whitelist={props.whitelist} />
      ) : (
        <Text>Sync active.</Text>
      )}
      <View flex={1} />
      {!!(activeJobs.length || removeJobs.length) && (
        <>
          <Text size={0.9} fontWeight={400}>
            {activeJobs.length ? 'Syncing...' : removeJobs.length ? 'Removing...' : name}
          </Text>
          {!removeJobs.length && (
            <>
              <TitleBarSpace />
              <TitleBarButton
                onClick={() => command(SourceForceCancelCommand, { sourceId: props.source.id })}
                size={0.8}
              >
                Cancel
              </TitleBarButton>
              <TitleBarSpace />
              <TitleBarSpace />
            </>
          )}
        </>
      )}
      <Text size={0.9} fontWeight={400} alpha={0.6}>
        {(bitsCount || 0).toLocaleString()} total
      </Text>
      <TitleBarSpace />
      <SegmentedRow spaced>
        <TitleBarButton
          disabled={removeJobs.length > 0 || activeJobs.length > 0}
          icon="remove"
          tooltip="Remove integration"
          onClick={() => removeIntegration(props.source)}
        />
        <TitleBarButton
          disabled={removeJobs.length > 0 || activeJobs.length > 0}
          tooltip="Sync"
          icon="refresh"
          onClick={() => handleRefresh(props.source.id)}
        />
      </SegmentedRow>
    </Row>
  )
}
