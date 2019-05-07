import { AppBit } from '@o/models'
import { Row, Text, View } from '@o/ui'
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
    <Row padding={[6, 15]} alignItems="center">
      {!!props.whitelist ? (
        <ManageSmartSync whitelist={props.whitelist} />
      ) : (
        <Text>Sync active.</Text>
      )}
      <View flex={1} />
      {props.app && (
        <React.Suspense fallback={null}>
          <ManageSyncStatus app={props.app} />
        </React.Suspense>
      )}
    </Row>
  )
}
