import { HorizontalSpace, Surface, Text, Theme } from '@mcro/ui'
import * as React from 'react'
import { CheckBox } from '../../../views/ReactiveCheckBox'
import { WhitelistManager } from '../../helpers/WhitelistManager'

export const ManageSmartSync = ({ whitelist }: { whitelist: WhitelistManager<any> }) => {
  return (
    <Theme name={whitelist.isWhitelisting ? 'selected' : null}>
      <Surface
        borderRadius={4}
        padding={[2, 6]}
        tooltip="Turning this on will let Orbit manage space"
      >
        <label style={{ flexFlow: 'row' }}>
          <CheckBox onChange={whitelist.toggleActive} checked={whitelist.isWhitelisting} />
          <HorizontalSpace />
          <Text>Smart sync</Text>
        </label>
      </Surface>
    </Theme>
  )
}
