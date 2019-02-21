import { Markdown, OrbitSourceMainProps } from '@mcro/kit'
import { Surface, View } from '@mcro/ui'
import * as React from 'react'
import { BitStatusBar } from '../../../views/layout/BitStatusBar'
import ScrollableContent from '../../../views/layout/ScrollableContent'

export class DriveApp extends React.Component<OrbitSourceMainProps<'drive'>> {
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
