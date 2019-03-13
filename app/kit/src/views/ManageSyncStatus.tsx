import { command } from '@o/bridge'
import { showConfirmDialog, useAppSyncState, useJobs } from '../'
import { AppBit, AppForceCancelCommand, AppForceSyncCommand, AppRemoveCommand } from '@o/models'
import { SegmentedRow, Text, TitleBarButton, TitleBarSpace, View } from '@o/ui'
import * as React from 'react'

const handleRefresh = async (appId: number) => {
  command(AppForceSyncCommand, {
    appId,
  })
}

const removeApp = async (app: AppBit) => {
  if (
    showConfirmDialog({
      title: 'Remove app?',
      message: `Are you sure you want to remove ${app.name}?`,
    })
  ) {
    command(AppRemoveCommand, {
      appId: app.id,
    })
  }
}

export function ManageSyncStatus(props: { app: AppBit }) {
  const appId = props.app && props.app.id
  const { bitsCount } = useAppSyncState(props.app)
  const { activeJobs, removeJobs } = useJobs(appId)

  if (!appId) {
    return null
  }

  return (
    <>
      {!!(activeJobs.length || removeJobs.length) && (
        <>
          <Text size={0.9} fontWeight={400}>
            {activeJobs.length ? 'Syncing...' : removeJobs.length ? 'Removing...' : name}{' '}
          </Text>
          {!removeJobs.length && (
            <>
              <TitleBarSpace />
              <TitleBarButton onClick={() => command(AppForceCancelCommand, { appId })} size={0.8}>
                Cancel
              </TitleBarButton>
              <TitleBarSpace />
              <TitleBarSpace />
            </>
          )}
        </>
      )}
      <View flex={1} />
      <Text size={0.9} fontWeight={400} alpha={0.6}>
        {(bitsCount || 0).toLocaleString()} total
      </Text>
      <TitleBarSpace />
      <SegmentedRow spaced>
        <TitleBarButton
          disabled={removeJobs.length > 0 || activeJobs.length > 0}
          tooltip="Sync"
          icon="refresh"
          onClick={() => handleRefresh(appId)}
        />
        <TitleBarButton
          icon="boldremove"
          tooltip={`Remove ${props.app.name}`}
          onClick={() => removeApp(props.app)}
        />
      </SegmentedRow>
    </>
  )
}
