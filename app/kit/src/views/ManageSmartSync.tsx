import { CheckBox, Label, Row, SizedSurface, Text } from '@o/ui'
import { useStore } from '@o/use-store'
import * as React from 'react'

import { WhiteList } from '../hooks/useWhiteList'

export function ManageSmartSync({ whitelist }: { whitelist: WhiteList }) {
  const store = useStore(whitelist)
  return (
    <SizedSurface
      alt={store.isWhitelisting ? 'selected' : null}
      sizeRadius
      sizePadding
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
