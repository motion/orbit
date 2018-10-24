import * as React from 'react'
import { View, Text } from '@mcro/ui'
import { NormalizedItem } from '../../../helpers/normalizeItem'
import { compose, view } from '@mcro/black'
import { AppStore } from '../../../pages/AppPage/AppStore'

type Props = {
  normalizedItem: NormalizedItem
  appStore?: AppStore
}

const decorate = compose(
  view.attach('appStore'),
  view,
)
export const AppSimpleTitleBar = decorate(({ appStore, normalizedItem }: Props) => {
  return (
    <View
      draggable
      onDragStart={appStore.onDragStart}
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
