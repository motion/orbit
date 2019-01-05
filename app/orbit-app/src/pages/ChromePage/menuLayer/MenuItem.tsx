import * as React from 'react'
import { View, Row, Text } from '@mcro/ui'
import { gloss } from '@mcro/gloss'

const MenuItemFrame = gloss(Row, {
  padding: [5, 8],
  alignItems: 'center',
  '&:hover': {
    background: [255, 255, 255, 0.2],
  },
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
