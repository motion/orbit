import { BitStatusBar, OrbitSourceMainProps, Readability } from '@mcro/kit'
import { ScrollableContent, Title, View } from '@mcro/ui'
import * as React from 'react'

export class WebsiteApp extends React.Component<OrbitSourceMainProps<'website'>> {
  render() {
    const { item } = this.props
    return (
      <>
        <ScrollableContent>
          <View padding={[16, 0]}>
            <Title>{item.title}</Title>
            <Readability>{item.body}</Readability>
          </View>
        </ScrollableContent>
        <BitStatusBar {...this.props} />
      </>
    )
  }
}
