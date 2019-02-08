import { Button, ButtonProps } from '@mcro/ui'
import * as React from 'react'

const borderColor = theme => theme.borderColor.alpha(0.75)
const background = theme => theme.background.alpha(0.1)

export const FloatingBarButton = React.forwardRef(function FloatingBarButtonSmall(
  { size, ...props }: ButtonProps,
  ref,
) {
  const s = size || 1
  return (
    <Button
      ref={ref}
      glint={false}
      fontWeight={500}
      alpha={0.8}
      sizeIcon={1.15 * s}
      sizeHeight={0.95 * s}
      sizePadding={1.2 * s}
      size={0.95 * s}
      sizeRadius={3 * s}
      themeSelect={false}
      borderColor={borderColor}
      background={background}
      {...props}
    />
  )
})
