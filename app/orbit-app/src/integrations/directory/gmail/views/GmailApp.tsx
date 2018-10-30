import * as React from 'react'
import { OrbitSourceMainProps } from '../../../types'
import { ScrollableContent } from '../../../views/layout/ScrollableContent'
import { View } from '@mcro/ui'
import { AppStatusBar } from '../../../views/layout/AppStatusBar'
import { BitTitleBar } from '../../../views/layout/BitTitleBar'
// import { Thread } from '../../../views/bits/thread/Thread'

export class GmailApp extends React.Component<OrbitSourceMainProps<'gmail'>> {
  render() {
    // const { bit } = this.props
    return (
      <View padding={16} flex={1}>
        <BitTitleBar {...this.props} />
        <ScrollableContent>{/* <Thread bit={bit} /> */}</ScrollableContent>
        <AppStatusBar {...this.props} />
      </View>
    )
  }
}
