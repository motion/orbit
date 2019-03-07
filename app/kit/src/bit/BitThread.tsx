import { ScrollableContent, Thread, Title, View } from '@o/ui'
import * as React from 'react'
import { BitStatusBar } from '../views/BitStatusBar'

export function BitThread({ item }) {
  return (
    <View flex={1}>
      <ScrollableContent>
        <Title>{item.title}</Title>
        <Thread {...item} />
      </ScrollableContent>
      <BitStatusBar {...this.props} />
    </View>
  )
}
