import { command } from '@mcro/model-bridge'
import {
  Source,
  SourceForceCancelCommand,
  SourceForceSyncCommand,
  SourceRemoveCommand,
} from '@mcro/models'
import { Row, SegmentedRow, Text, View } from '@mcro/ui'
import * as React from 'react'
import { AppActions } from '../../../actions/AppActions'
import { showConfirmDialog } from '../../../helpers/electron/showConfirmDialog'
import { useJobs } from '../../../hooks/useJobs'
import { useSourceInfo } from '../../../hooks/useSourceInfo'
import { getAppFromSource } from '../../../stores/SourcesStore'
import { WhitelistManager } from '../../helpers/WhitelistManager'
import { TitleBarButton } from '../layout/TitleBarButton'
import { TitleBarSpace } from '../layout/TitleBarSpace'
import { ManageSmartSync } from './ManageSmartSync'

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
  const sourceId = props.source && props.source.id
  const { bitsCount } = useSourceInfo(sourceId)
  const { activeJobs, removeJobs } = useJobs(sourceId)

  if (!sourceId) {
    return null
  }

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
                onClick={() => command(SourceForceCancelCommand, { sourceId })}
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
          tooltip="Sync"
          icon="refresh"
          onClick={() => handleRefresh(sourceId)}
        />
        <TitleBarButton
          disabled={removeJobs.length > 0 || activeJobs.length > 0}
          icon="remove"
          tooltip={`Remove ${props.source.name}`}
          onClick={() => removeIntegration(props.source)}
        />
      </SegmentedRow>
    </Row>
  )
}
