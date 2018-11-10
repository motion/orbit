import * as React from 'react'
import { View, Text } from '@mcro/ui'

type Props = {
  title: string
  onDragStart?: Function
}

export const AppSimpleTitleBar = ({ onDragStart, title }: Props) => {
  return (
    <View
      draggable
      onDragStart={onDragStart}
      position="absolute"
      top={0}
      left={30}
      right={30}
      paddingTop={3}
      alignItems="center"
    >
      <Text
        ellipse
        maxWidth="100%"
        selectable={false}
        size={0.85}
        fontWeight={600}
        alignItems="center"
      >
        {title}
      </Text>
    </View>
  )
}
