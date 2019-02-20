import { Document, OrbitSourceMainProps } from '@mcro/kit'
import { View } from '@mcro/ui'
import * as React from 'react'
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
