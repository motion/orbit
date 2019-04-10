import { Button, ButtonProps, Row } from '@o/ui'
import React from 'react'

export function Dock(props: { children: any }) {
  return (
    <Row position="absolute" bottom={0} right={0} space>
      {props.children}
    </Row>
  )
}

const width = 40
const innerSpace = 20
const outerSpace = 20

export function DockButton({ index, ...buttonProps }: ButtonProps & { index: number }) {
  return (
    <Button
      circular
      icon="list"
      size={1.4}
      iconSize={16}
      elevation={4}
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
