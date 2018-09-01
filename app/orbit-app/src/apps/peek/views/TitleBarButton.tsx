import * as React from 'react'
import { Button } from '@mcro/ui'

export const TitleBarButton = props => (
  <Button
    sizeRadius={0.75}
    sizePadding={0.95}
    sizeHeight={0.92}
    iconSize={12}
    {...props}
  />
)
