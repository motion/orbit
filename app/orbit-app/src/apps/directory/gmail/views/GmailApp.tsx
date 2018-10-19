import * as React from 'react'
import { OrbitAppMainProps } from '../../../types'
import { ScrollableContent } from '../../../views/layout/ScrollableContent'
import { View } from '@mcro/ui'
import { AppStatusBar } from '../../../views/layout/AppStatusBar'
import { BitTitleBar } from '../../../views/layout/BitTitleBar'
import { Thread } from '../../../views/bits/thread/Thread'

export class GmailApp extends React.Component<OrbitAppMainProps<'gmail'>> {
  render() {
    const { bit } = this.props
    return (
      <View padding={16} flex={1}>
        <BitTitleBar {...this.props} />
        <View margin={[0, -20]}>
          <ScrollableContent>
            <Thread bit={bit} />
          </ScrollableContent>
        </View>
        <AppStatusBar {...this.props} />
      </View>
    )
  }
}
