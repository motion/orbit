import { OrbitSourceMainProps, Thread } from '@mcro/kit'
import { Title, View } from '@mcro/ui'
import * as React from 'react'
import { BitStatusBar } from '../../../views/layout/BitStatusBar'
import ScrollableContent from '../../../views/layout/ScrollableContent'

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
