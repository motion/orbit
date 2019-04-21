import React, { forwardRef } from 'react'

import { Button, ButtonProps } from './Button'

export const RoundButton = forwardRef((props: ButtonProps, ref) => {
  return (
    <Button
      ref={ref}
      glint={false}
      sizeRadius={3}
      sizePadding={1.2}
      sizeHeight={0.95}
      fontWeight={300}
      display="inline-flex"
      {...props}
    />
  )
})
