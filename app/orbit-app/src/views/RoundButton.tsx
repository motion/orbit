import * as UI from '@mcro/ui'
import * as React from 'react'

export const RoundButton = (props: UI.ButtonProps) => (
  <UI.Button
    glint={false}
    sizeRadius={100}
    borderWidth={0}
    fontWeight={300}
    display="inline-flex"
    {...props}
  />
)
