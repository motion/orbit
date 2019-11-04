import { CheckBox, Label, Stack, Surface, Text } from '@o/ui'
import * as React from 'react'

import { WhiteList } from '../hooks/useWhiteList'

export function ManageSmartSync({ whitelist }: { whitelist: WhiteList }) {
  return (
    // @ts-ignore
    <Surface
      coat={whitelist.isWhitelisting ? 'selected' : undefined}
      sizeRadius
      sizePadding
      sizeHeight
      alignItems="center"
      tooltip="Turning this on will let Orbit manage space"
      showInnerElement="never"
    >
      <Label>
        <Stack direction="horizontal" space>
          <CheckBox onChange={whitelist.toggleActive} checked={whitelist.isWhitelisting} />
          <Text>Smart sync</Text>
        </Stack>
      </Label>
    </Surface>
  )
}
