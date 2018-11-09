import * as React from 'react'
import { OrbitSourceMainProps } from '../../../types'
import { ScrollableContent } from '../../../views/layout/ScrollableContent'
import { Surface, View } from '@mcro/ui'
import { AppStatusBar } from '../../../views/layout/AppStatusBar'
import { Readability } from '../../../views/bits/readability/Readability'
import { Title } from '../../../../views'

export class WebsiteApp extends React.Component<OrbitSourceMainProps<'website'>> {
  render() {
    const { bit } = this.props
    return (
      <Surface flexFlow="column" hover={false} noInnerElement padding={16} flex={1}>
        <ScrollableContent>
          <View padding={[16, 0]}>
            <Title>{bit.title}</Title>
            <Readability>{bit.body}</Readability>
          </View>
        </ScrollableContent>
        <AppStatusBar {...this.props} />
      </Surface>
    )
  }
}
