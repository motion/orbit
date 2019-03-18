import { AppBit } from '@o/models'
import { Row, Text, View } from '@o/ui'
import * as React from 'react'
import { WhitelistManager } from '../helpers/WhitelistManager'
import { ManageSmartSync } from './ManageSmartSync'
import { ManageSyncStatus } from './ManageSyncStatus'

export const SettingManageRow = (props: { app: AppBit; whitelist: WhitelistManager<any> }) => {
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
      {props.app && <ManageSyncStatus app={props.app} />}
    </Row>
  )
}
