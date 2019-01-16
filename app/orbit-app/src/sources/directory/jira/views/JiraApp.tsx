import * as React from 'react'
import { OrbitSourceMainProps } from '../../../types'
import ScrollableContent from '../../../views/layout/ScrollableContent'
import { Surface, View } from '@mcro/ui'
import { BitStatusBar } from '../../../views/layout/BitStatusBar'
import { Document } from '../../../views/bits/document/Document'

export class JiraApp extends React.Component<OrbitSourceMainProps<'jira'>> {
  render() {
    const { item } = this.props
    return (
      <Surface flexFlow="column" hover={false} noInnerElement padding={16} flex={1}>
        <ScrollableContent>
          <View padding={[16, 0]}>
            <Document {...this.props}>{item.body}</Document>
          </View>
        </ScrollableContent>
        <BitStatusBar {...this.props} />
      </Surface>
    )
  }
}
