import { View } from '@mcro/ui'
import * as React from 'react'
import { OrbitSourceMainProps } from '../../../types'
import { Thread } from '../../../views/bits/thread/Thread'
import { BitStatusBar } from '../../../views/layout/BitStatusBar'
import ScrollableContent from '../../../views/layout/ScrollableContent'

export class GmailApp extends React.Component<OrbitSourceMainProps<'gmail'>> {
  render() {
    const { item } = this.props
    return (
      <View flex={1}>
        <ScrollableContent>
          <Thread item={item} />
        </ScrollableContent>
        <BitStatusBar {...this.props} />
      </View>
    )
  }
}
