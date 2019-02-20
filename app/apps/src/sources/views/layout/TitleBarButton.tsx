import { Button } from '@mcro/ui'
import * as React from 'react'

// !TODO type ButtonProps complains about cant export type
export const TitleBarButton = React.forwardRef((props: any /*: ButtonProps */, ref) => {
  return (
    <Button
      ref={ref}
      size={0.9}
      sizeRadius={1}
      sizeFont={1.1}
      sizePadding={0.95}
      iconSize={11}
      {...props}
    />
  )
})
