import { Title, TitleProps } from '@o/ui'
import React, { forwardRef } from 'react'

const titleProps = {
  size: 'lg',
  fontWeight: 800,
  selectable: true,
}

export const TitleText = (props: TitleProps) => (
  <Title className="font-smooth" selectable sizeLineHeight={1.1} {...titleProps} {...props} />
)
