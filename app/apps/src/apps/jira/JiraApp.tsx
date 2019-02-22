import { BitStatusBar, Document, OrbitSourceMainProps } from '@mcro/kit'
import { ScrollableContent, Surface, View } from '@mcro/ui'
import * as React from 'react'

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
