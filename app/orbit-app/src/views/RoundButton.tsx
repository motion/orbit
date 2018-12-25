import * as React from 'react'
import * as UI from '@mcro/ui'

export const RoundButton = props => (
  <UI.Button
    sizeRadius={100}
    glint={false}
    borderWidth={0}
    fontWeight={300}
    display="inline-flex"
    {...props}
  />
)
