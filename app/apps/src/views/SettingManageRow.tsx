import { command } from '@mcro/bridge'
import { getAppFromSource, showConfirmDialog, useJobs, useSourceInfo } from '@mcro/kit'
import {
  Source,
  SourceForceCancelCommand,
  SourceForceSyncCommand,
  SourceRemoveCommand,
} from '@mcro/models'
import { Row, SegmentedRow, Text, TitleBarButton, TitleBarSpace, View } from '@mcro/ui'
import * as React from 'react'
import { WhitelistManager } from '../WhitelistManager'
import { ManageSmartSync } from './ManageSmartSync'

const handleRefresh = async (sourceId: number) => {
  command(SourceForceSyncCommand, {
    sourceId,
  })
}

const removeSource = async (source: Source) => {
  if (
    showConfirmDialog({
      title: 'Remove source?',
      message: `Are you sure you want to remove ${getAppFromSource(source).name}?`,
    })
  ) {
    command(SourceRemoveCommand, {
      sourceId: source.id,
    })
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
            {activeJobs.length ? 'Syncing...' : removeJobs.length ? 'Removing...' : name}{' '}
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
          icon="boldremove"
          tooltip={`Remove ${props.source.name}`}
          onClick={() => removeSource(props.source)}
        />
      </SegmentedRow>
    </Row>
  )
}
