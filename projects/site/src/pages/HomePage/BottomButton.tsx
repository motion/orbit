import { Button, ButtonProps, Image, useTheme } from '@o/ui'
import React from 'react'

export const BottomButton = ({
  src,
  href,
  ...props
}: ButtonProps & {
  src?: string
  href?: any
}) => {
  const theme = useTheme()
  return (
    <Button
      color={theme.color}
      alt="clear"
      elementProps={{
        href,
        tagName: 'a',
        target: '_blank',
      }}
      userSelect="none"
      circular
      size={2}
      cursor="pointer"
      {...props}
    >
      {(!!src && <Image width={25} height={25} src={src} />) || props.children}
    </Button>
  )
}
