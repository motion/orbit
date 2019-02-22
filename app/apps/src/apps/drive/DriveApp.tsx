import { BitStatusBar, Markdown, OrbitSourceMainProps } from '@mcro/kit'
import { ScrollableContent, Surface, View } from '@mcro/ui'
import * as React from 'react'

export class DriveApp extends React.Component<OrbitSourceMainProps> {
  render() {
    const { item } = this.props
    return (
      <Surface flexFlow="column" hover={false} noInnerElement padding={16} flex={1}>
        <ScrollableContent>
          <View padding={[16, 0]}>
            <Markdown source={item.body} />
          </View>
        </ScrollableContent>
        <BitStatusBar {...this.props} />
      </Surface>
    )
  }
}
