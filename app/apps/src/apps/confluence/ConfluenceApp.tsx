import { BitStatusBar, Document, OrbitSourceMainProps } from '@mcro/kit'
import { ScrollableContent, View } from '@mcro/ui'
import * as React from 'react'

export class ConfluenceApp extends React.Component<OrbitSourceMainProps> {
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
