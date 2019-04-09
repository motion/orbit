import { CheckBox, Space, Surface, Text } from '@o/ui'
import * as React from 'react'
import { WhiteList } from '../hooks/useWhiteList'

export function ManageSmartSync({ whitelist }: { whitelist: WhiteList }) {
  return (
    <Surface
      alt={whitelist.isWhitelisting ? 'selected' : null}
      borderRadius={4}
      padding={[2, 6]}
      tooltip="Turning this on will let Orbit manage space"
    >
      <label style={{ flexFlow: 'row' }}>
        <CheckBox onChange={whitelist.toggleActive} checked={whitelist.isWhitelisting} />
        <Space />
        <Text>Smart sync</Text>
      </label>
    </Surface>
  )
}
