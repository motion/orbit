import * as React from 'react'
import { Popover, Col } from '@mcro/ui'

export function Menu({ open, left, width, children }) {
  return (
    <Popover
      open={open}
      background
      width={width}
      towards="bottom"
      top={0}
      distance={8}
      left={left}
      maxHeight={300}
      elevation={6}
      theme="dark"
    >
      <Col overflowX="hidden" overflowY="auto" flex={1}>
        {children}
      </Col>
    </Popover>
  )
}

{
  /* <View
      width={width}
      maxHeight={300}

      background="#fff"
      borderBottomRadius={10}
      boxShadow={[[0, 0, 60, [0, 0, 0, 0.5]]]}
      position="absolute"
      top={0}
      left={store.menuCenter - width / 2}
      opacity={store.showMenu ? 1 : 0}
      transform={{
        x: store.showMenu ? 0 : -10,
      }}
      transition="all ease 200ms"
    > */
}
