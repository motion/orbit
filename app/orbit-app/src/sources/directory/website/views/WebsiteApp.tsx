import * as React from 'react'
import { OrbitSourceMainProps } from '../../../types'
import { ScrollableContent } from '../../../views/layout/ScrollableContent'
import { View } from '@mcro/ui'
import { BitStatusBar } from '../../../views/layout/BitStatusBar'
import { Readability } from '../../../views/bits/readability/Readability'
import { Title } from '../../../../views'

export class WebsiteApp extends React.Component<OrbitSourceMainProps<'website'>> {
  render() {
    const { bit } = this.props
    return (
      <>
        <ScrollableContent>
          <View padding={[16, 0]}>
            <Title>{bit.title}</Title>
            <Readability>{bit.body}</Readability>
          </View>
        </ScrollableContent>
        <BitStatusBar {...this.props} />
      </>
    )
  }
}
