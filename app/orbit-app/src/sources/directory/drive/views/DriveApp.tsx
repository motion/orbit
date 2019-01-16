import * as React from 'react'
import { OrbitSourceMainProps } from '../../../types'
import ScrollableContent from '../../../views/layout/ScrollableContent'
import { Surface, View } from '@mcro/ui'
import { BitStatusBar } from '../../../views/layout/BitStatusBar'
import { Markdown } from '../../../../views/Markdown'

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
