import * as React from 'react'
import { OrbitSourceMainProps } from '../../../types'
import ScrollableContent from '../../../views/layout/ScrollableContent'
import { View } from '@mcro/ui'
import { BitStatusBar } from '../../../views/layout/BitStatusBar'
import { Document } from '../../../views/bits/document/Document'

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
