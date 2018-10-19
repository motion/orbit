import * as React from 'react'
import { Text } from '@mcro/ui'
import { WhitelistManager } from '../../helpers/WhitelistManager'
import { CheckBox } from '../../../views/ReactiveCheckBox'
import { HorizontalSpace } from '../../../views'

export const ManageSmartSync = ({ whitelist }: { whitelist: WhitelistManager<any> }) => {
  return (
    <>
      <CheckBox onChange={whitelist.toggleActive} checked={whitelist.isWhitelisting} />
      <HorizontalSpace />
      <Text>Smart sync all</Text>
    </>
  )
}
