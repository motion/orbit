import * as React from 'react'
import { OrbitSourceMainProps } from '../../../types'
import { ScrollableContent } from '../../../views/layout/ScrollableContent'
import { Surface, View } from '@mcro/ui'
import { AppStatusBar } from '../../../views/layout/AppStatusBar'
import { Document } from '../../../views/bits/document/Document'

export class ConfluenceApp extends React.Component<OrbitSourceMainProps<'confluence'>> {
  render() {
    return (
      <Surface flexFlow="column" hover={false} noInnerElement padding={16} flex={1}>
        <ScrollableContent>
          <View padding={[16, 0]}>
            <Document {...this.props} />
          </View>
        </ScrollableContent>
        <AppStatusBar {...this.props} />
      </Surface>
    )
  }
}
