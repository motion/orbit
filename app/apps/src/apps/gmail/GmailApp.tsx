import { BitStatusBar, OrbitSourceMainProps, Thread } from '@mcro/kit'
import { ScrollableContent, Title, View } from '@mcro/ui'
import * as React from 'react'

export class GmailApp extends React.Component<OrbitSourceMainProps<'gmail'>> {
  render() {
    const { item } = this.props
    return (
      <View flex={1}>
        <ScrollableContent>
          <Title>{item.title}</Title>
          <Thread item={item} />
        </ScrollableContent>
        <BitStatusBar {...this.props} />
      </View>
    )
  }
}
