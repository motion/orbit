import { Absolute, Row, ViewProps } from '@mcro/ui'
import * as React from 'react'

export function FloatingBarBottom({ children, ...props }: ViewProps) {
  return (
    <Absolute bottom={16} left={16} right={16} zIndex={100000} {...props}>
      <Row>{children}</Row>
    </Absolute>
  )
}
