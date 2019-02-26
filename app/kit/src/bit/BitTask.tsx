import { Document, ScrollableContent, Surface, View } from '@mcro/ui'
import * as React from 'react'
import { BitStatusBar } from '../views/BitStatusBar'

export function BitTask({ item }) {
  return (
    <Surface flexFlow="column" hover={false} noInnerElement padding={16} flex={1}>
      <ScrollableContent>
        <View padding={[16, 0]}>
          <Document {...this.props}>{item.body}</Document>
        </View>
      </ScrollableContent>
      <BitStatusBar {...this.props} />
    </Surface>
  )
}
