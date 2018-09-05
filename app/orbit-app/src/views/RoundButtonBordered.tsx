import * as React from 'react'
import * as UI from '@mcro/ui'

export const RoundButtonBordered = props => (
  <UI.Button
    sizeRadius={100}
    glint={false}
    borderWidth={1}
    fontWeight={300}
    display="inline-flex"
    {...props}
  />
)
