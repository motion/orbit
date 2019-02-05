import { Button, ButtonProps } from '@mcro/ui'
import * as React from 'react'

const borderColor = theme => theme.borderColor.alpha(0.75)
const background = theme => theme.background.alpha(0.1)

export const FloatingBarButton = React.forwardRef(function FloatingBarButtonSmall(
  props: ButtonProps,
  ref,
) {
  return (
    <Button
      ref={ref}
      glint={false}
      fontWeight={500}
      alpha={0.8}
      sizeIcon={1.15}
      sizeHeight={0.95}
      sizePadding={1.2}
      size={0.95}
      sizeRadius={3}
      themeSelect={false}
      borderColor={borderColor}
      background={background}
      {...props}
    />
  )
})
