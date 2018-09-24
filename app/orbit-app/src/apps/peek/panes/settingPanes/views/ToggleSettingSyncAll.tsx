import * as React from 'react'
import { Text, Row, View } from '@mcro/ui'
import { CheckBox } from '../../../../../views/ReactiveCheckBox'
import { HorizontalSpace } from '../../../../../views'

export const ToggleSettingSyncAll = ({ store }) => {
  return (
    <Row padding={[6, 15]}>
      <View flex={1} />
      <Text>Sync all</Text>
      <HorizontalSpace />
      <CheckBox onChange={store.toggleSyncAll} checked={store.isSyncAllEnabled} />
    </Row>
  )
}
