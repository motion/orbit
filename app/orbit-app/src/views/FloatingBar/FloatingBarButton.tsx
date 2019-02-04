import { Button, ButtonProps } from '@mcro/ui'
import * as React from 'react'

export const FloatingBarButton = React.forwardRef(function FloatingBarButtonSmall(
  props: ButtonProps,
  ref,
) {
  return (
    <Button
      ref={ref}
      glint={false}
      borderWidth={0}
      fontWeight={400}
      sizePadding={1.2}
      sizeRadius={3}
      themeSelect={false}
      background={theme => theme.background}
      {...props}
    />
  )
})
