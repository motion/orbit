import * as React from 'react'
import { Text } from '@mcro/ui'
import { CheckBox } from '../../../../../views/ReactiveCheckBox'
import { HorizontalSpace } from '../../../../../views'
import { WhitelistManager } from '../stores/WhitelistManager'

export const ManageSmartSync = ({ whitelist }: { whitelist: WhitelistManager<any> }) => {
  return (
    <>
      <CheckBox onChange={whitelist.toggleActive} checked={whitelist.isWhitelisting} />
      <HorizontalSpace />
      <Text>Smart sync all</Text>
    </>
  )
}
