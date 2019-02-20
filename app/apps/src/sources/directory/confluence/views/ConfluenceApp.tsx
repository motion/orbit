import { View } from '@mcro/ui'
import * as React from 'react'
import { OrbitSourceMainProps } from '../../../types'
import { Document } from '../../../views/bits/document/Document'
import { BitStatusBar } from '../../../views/layout/BitStatusBar'
import ScrollableContent from '../../../views/layout/ScrollableContent'

export class ConfluenceApp extends React.Component<OrbitSourceMainProps<'confluence'>> {
  render() {
    return (
      <>
        <ScrollableContent>
          <View padding={[16, 0]}>
            <Document {...this.props} />
          </View>
        </ScrollableContent>
        <BitStatusBar {...this.props} />
      </>
    )
  }
}
