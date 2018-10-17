import * as React from 'react'
import { View, Text } from '@mcro/ui'
import { NormalizedItem } from '../../components/ItemResolver'

export const AppSimpleTitleBar = ({ normalizedItem }: { normalizedItem: NormalizedItem }) => {
  return (
    <View position="absolute" top={3} left={0} right={0} alignItems="center">
      <Text selectable={false} size={0.85} fontWeight={600} alignItems="center">
        {normalizedItem.title}
      </Text>
    </View>
  )
}
