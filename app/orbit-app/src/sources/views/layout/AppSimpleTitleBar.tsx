import * as React from 'react'
import { View, Text } from '@mcro/ui'
import { NormalizedItem } from '../../../helpers/normalizeItem'
import { compose, view, attach } from '@mcro/black'
import { AppPageStore } from '../../../pages/AppPage/AppPageStore'

type Props = {
  normalizedItem: NormalizedItem
  viewStore?: AppPageStore
}

const decorate = compose(
  attach('viewStore'),
  view,
)
export const AppSimpleTitleBar = decorate(({ viewStore, normalizedItem }: Props) => {
  return (
    <View
      draggable
      onDragStart={viewStore.onDragStart}
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
        {normalizedItem.title}
      </Text>
    </View>
  )
})
