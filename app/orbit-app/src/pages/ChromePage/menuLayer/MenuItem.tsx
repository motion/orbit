import * as React from 'react'
import { view } from '@mcro/black'
import { View, Row, Text } from '@mcro/ui'

const MenuItemFrame = view(Row, {
  padding: [5, 8],
  alignItems: 'center',
})

export function MenuItem(props) {
  return (
    <MenuItemFrame>
      <Text size={1.2} alpha={0.8}>
        {props.children}
      </Text>
      <View flex={1} />
      <Text size={1.4}>{props.icon}</Text>
    </MenuItemFrame>
  )
}
