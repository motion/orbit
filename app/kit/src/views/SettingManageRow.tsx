import { command } from '@o/bridge'
import { showConfirmDialog, useAppSyncState, useJobs, WhitelistManager } from '../'
import { AppBit, AppForceCancelCommand, AppForceSyncCommand, AppRemoveCommand } from '@o/models'
import { Row, SegmentedRow, Text, TitleBarButton, TitleBarSpace, View } from '@o/ui'
import * as React from 'react'
import { ManageSmartSync } from './ManageSmartSync'

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

export const SettingManageRow = (props: { app: AppBit; whitelist: WhitelistManager<any> }) => {
  const appId = props.app && props.app.id
  const { bitsCount } = useAppSyncState(props.app)
  const { activeJobs, removeJobs } = useJobs(appId)

  if (!appId) {
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
              <TitleBarButton onClick={() => command(AppForceCancelCommand, { appId })} size={0.8}>
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
          onClick={() => handleRefresh(appId)}
        />
        <TitleBarButton
          icon="boldremove"
          tooltip={`Remove ${props.app.name}`}
          onClick={() => removeApp(props.app)}
        />
      </SegmentedRow>
    </Row>
  )
}
