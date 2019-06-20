import { CheckBox, Label, Row, Surface, Text } from '@o/ui'
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
      <Label>
        <Row space>
          <CheckBox onChange={whitelist.toggleActive} checked={whitelist.isWhitelisting} />
          <Text>Smart sync</Text>
        </Row>
      </Label>
    </Surface>
  )
}
