import * as React from 'react'
import { OrbitSourceMainProps } from '../../../types'
import ScrollableContent from '../../../views/layout/ScrollableContent'
import { View } from '@mcro/ui'
import { BitStatusBar } from '../../../views/layout/BitStatusBar'
import { Thread } from '../../../views/bits/thread/Thread'

export class GmailApp extends React.Component<OrbitSourceMainProps<'gmail'>> {
  render() {
    const { item } = this.props
    return (
      <View padding={16} flex={1}>
        <ScrollableContent>
          <Thread item={item} />
        </ScrollableContent>
        <BitStatusBar {...this.props} />
      </View>
    )
  }
}
