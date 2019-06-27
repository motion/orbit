import { command } from '@o/bridge'
import { AppBit, AppForceCancelCommand, AppForceSyncCommand } from '@o/models'
import { Button, Space, SpaceGroup, Text, View } from '@o/ui'
import * as React from 'react'

import { removeApp } from '../helpers/removeApp'
import { useAppSyncState } from '../hooks/useAppSyncState'
import { useJobs } from '../hooks/useJobs'

const handleRefresh = async (appId: number) => {
  command(AppForceSyncCommand, {
    appId,
  })
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
            {activeJobs.length ? 'Syncing...' : removeJobs.length ? 'Removing...' : props.app.name}{' '}
          </Text>
          {!removeJobs.length && (
            <>
              <Space />
              <Button onClick={() => command(AppForceCancelCommand, { appId })} size={0.8}>
                Cancel
              </Button>
              <Space />
              <Space />
            </>
          )}
        </>
      )}
      <View flex={1} />
      <Text size={0.9} fontWeight={400} alpha={0.6}>
        {(bitsCount || 0).toLocaleString()} total
      </Text>
      <Space />
      <SpaceGroup space="sm">
        <Button
          disabled={removeJobs.length > 0 || activeJobs.length > 0}
          tooltip="Sync"
          icon="refresh"
          onClick={() => handleRefresh(appId)}
        />
        <Button
          icon="cross"
          tooltip={`Remove ${props.app.name}`}
          onClick={() => removeApp(props.app)}
        />
      </SpaceGroup>
    </>
  )
}
