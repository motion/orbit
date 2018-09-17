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

export const RoundButtonBorderedSmall = props => (
  <RoundButtonBordered
    sizeHeight={0.75}
    sizePadding={0.75}
    size={0.9}
    fontWeight={500}
    {...props}
  />
)
