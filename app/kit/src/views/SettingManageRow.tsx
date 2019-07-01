import { AppBit } from '@o/models'
import { Row, Space, Text } from '@o/ui'
import * as React from 'react'

import { WhiteList } from '../hooks/useWhiteList'
import { ManageSmartSync } from './ManageSmartSync'
import { ManageSyncStatus } from './ManageSyncStatus'

export function SettingManageRow(props: { app: AppBit; whitelist: WhiteList }) {
  const appId = props.app && props.app.id

  if (!appId) {
    return null
  }

  return (
    <Row padding alignItems="center">
      {!!props.whitelist ? (
        <ManageSmartSync whitelist={props.whitelist} />
      ) : (
        <Text>Sync active.</Text>
      )}
      <Space flex={1} />
      {props.app && (
        <React.Suspense fallback={null}>
          <ManageSyncStatus app={props.app} />
        </React.Suspense>
      )}
    </Row>
  )
}
