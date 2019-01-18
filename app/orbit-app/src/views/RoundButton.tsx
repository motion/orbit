import * as UI from '@mcro/ui'
import * as React from 'react'

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
