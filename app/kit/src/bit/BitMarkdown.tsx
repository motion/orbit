import { Markdown, ScrollableContent, Surface, View } from '@o/ui'
import * as React from 'react'
import { BitStatusBar } from '../views/BitStatusBar'

export function BitMarkdown({ item }) {
  return (
    <Surface flexFlow="column" hover={false} noInnerElement padding={16} flex={1}>
      <ScrollableContent>
        <View padding={[16, 0]}>
          <Markdown {...this.props}>{item.body}</Markdown>
        </View>
      </ScrollableContent>
      <BitStatusBar {...this.props} />
    </Surface>
  )
}
