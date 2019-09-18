import { CheckBox, Label, Row, SizedSurface, Text } from '@o/ui'
import * as React from 'react'

import { WhiteList } from '../hooks/useWhiteList'

export function ManageSmartSync({ whitelist }: { whitelist: WhiteList }) {
  return (
    <SizedSurface
      coat={whitelist.isWhitelisting ? 'selected' : null}
      sizeRadius
      sizePadding
      sizeHeight={1}
      alignItems="center"
      tooltip="Turning this on will let Orbit manage space"
    >
      <Label>
        <Row space>
          <CheckBox onChange={whitelist.toggleActive} checked={whitelist.isWhitelisting} />
          <Text>Smart sync</Text>
        </Row>
      </Label>
    </SizedSurface>
  )
}
