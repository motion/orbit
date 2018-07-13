import * as React from 'react'
import * as UI from '@mcro/ui'

export const RoundButton = UI.forwardRef(props => (
  <UI.Button
    sizeRadius={10}
    sizeHeight={0.83}
    sizePadding={1.2}
    borderWidth={0}
    fontWeight={300}
    display="inline-flex"
    {...props}
  />
))
