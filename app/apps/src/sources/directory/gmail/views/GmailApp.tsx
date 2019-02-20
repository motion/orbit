import { View } from '@mcro/ui'
import * as React from 'react'
import { SectionTitle } from '../../../../views/Section'
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
          <SectionTitle>{item.title}</SectionTitle>
          <Thread item={item} />
        </ScrollableContent>
        <BitStatusBar {...this.props} />
      </View>
    )
  }
}
