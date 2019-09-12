import React from 'react'

import { Button, ButtonProps } from './Button'

export const RoundButton = (props: ButtonProps) => {
  return (
    <Button
      glint={false}
      sizeRadius={3}
      sizePadding={1.2}
      sizeHeight={0.95}
      display="inline-flex"
      {...props}
    />
  )
}
