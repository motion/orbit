import * as React from 'react'
import { OrbitAppMainProps } from '../../../types'
import { ScrollableContent } from '../../../views/ScrollableContent'
import { Surface, View } from '@mcro/ui'
import { AppStatusBar } from '../../../views/AppStatusBar'
import { BitTitleBar } from '../../../views/BitTitleBar'

export class GmailApp extends React.Component<OrbitAppMainProps<'gmail'>> {
  render() {
    // const { bit } = this.props
    return (
      <Surface flexFlow="column" hover={false} noInnerElement padding={16} flex={1}>
        <BitTitleBar {...this.props} />
        <ScrollableContent>
          <View padding={[16, 0]}>123</View>
        </ScrollableContent>
        <AppStatusBar {...this.props} />
      </Surface>
    )
  }
}
