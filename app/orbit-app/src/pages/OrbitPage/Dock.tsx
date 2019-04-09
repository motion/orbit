import { Button, ButtonProps, Row } from '@o/ui'
import React from 'react'

export function Dock(props: { children: any }) {
  return <Row space>{props.children}</Row>
}

const width = 45
const innerSpace = 20
const outerSpace = 20

export function DockButton({ index, ...buttonProps }: ButtonProps & { index: number }) {
  return (
    <Button
      circular
      icon="list"
      size={1.5}
      iconSize={16}
      badgeProps={{
        background: '#333',
      }}
      position="fixed"
      bottom={outerSpace}
      right={outerSpace + innerSpace * index + width * index}
      zIndex={100000000}
      transition="all ease 150ms"
      {...buttonProps}
    />
  )
}
