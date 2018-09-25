import * as React from 'react'
import { Text, Row, View } from '@mcro/ui'
import { CheckBox } from '../../../../../views/ReactiveCheckBox'
import { HorizontalSpace } from '../../../../../views'
import { WhitelistManager } from '../stores/WhitelistManager'

export const ManageSmartSync = ({ whitelist }: { whitelist: WhitelistManager<any> }) => {
  return (
    <Row padding={[6, 15]}>
      <View flex={1} />
      <Text>Smart sync all</Text>
      <HorizontalSpace />
      <CheckBox onChange={whitelist.toggleActive} checked={whitelist.isWhitelisting} />
    </Row>
  )
}
