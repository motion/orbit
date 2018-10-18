import * as React from 'react'
import { OrbitAppMainProps } from '../../../types'
import { ScrollableContent } from '../../../views/layout/ScrollableContent'
import { Surface, View } from '@mcro/ui'
import { AppStatusBar } from '../../../views/layout/AppStatusBar'
import { BitTitleBar } from '../../../views/layout/BitTitleBar'

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
