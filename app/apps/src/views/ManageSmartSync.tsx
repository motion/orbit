import { CheckboxReactive, HorizontalSpace, Surface, Text, Theme } from '@mcro/ui'
import * as React from 'react'
import { WhitelistManager } from '../WhitelistManager'

export const ManageSmartSync = ({ whitelist }: { whitelist: WhitelistManager<any> }) => {
  return (
    <Theme name={whitelist.isWhitelisting ? 'selected' : null}>
      <Surface
        borderRadius={4}
        padding={[2, 6]}
        tooltip="Turning this on will let Orbit manage space"
      >
        <label style={{ flexFlow: 'row' }}>
          <CheckboxReactive onChange={whitelist.toggleActive} checked={whitelist.isWhitelisting} />
          <HorizontalSpace />
          <Text>Smart sync</Text>
        </label>
      </Surface>
    </Theme>
  )
}
