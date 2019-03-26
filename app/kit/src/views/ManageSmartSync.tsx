import { CheckboxReactive, Space, Surface, Text } from '@o/ui'
import * as React from 'react'
import { WhitelistManager } from '../helpers/WhitelistManager'

export const ManageSmartSync = ({ whitelist }: { whitelist: WhitelistManager<any> }) => {
  return (
    <Surface
      alt={whitelist.isWhitelisting ? 'selected' : null}
      borderRadius={4}
      padding={[2, 6]}
      tooltip="Turning this on will let Orbit manage space"
    >
      <label style={{ flexFlow: 'row' }}>
        <CheckboxReactive
          onChange={whitelist.toggleActive}
          isActive={whitelist.getIsWhitelisting}
        />
        <Space />
        <Text>Smart sync</Text>
      </label>
    </Surface>
  )
}
