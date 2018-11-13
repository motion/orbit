import * as React from 'react'
import { View, Text } from '@mcro/ui'
import { StoreContext } from '@mcro/black'

type Props = {
  title: string
}

export const AppSimpleTitleBar = ({ title }: Props) => {
  const { appPageStore } = React.useContext(StoreContext)
  return (
    <View
      draggable
      onDragStart={appPageStore.onDragStart}
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
