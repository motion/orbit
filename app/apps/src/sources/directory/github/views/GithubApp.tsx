import { OrbitSourceMainProps, Task } from '@mcro/kit'
import { Title, View } from '@mcro/ui'
import * as React from 'react'
import { BitStatusBar } from '../../../views/layout/BitStatusBar'
import ScrollableContent from '../../../views/layout/ScrollableContent'

export class GithubApp extends React.Component<OrbitSourceMainProps<'github'>> {
  render() {
    const { item } = this.props
    return (
      <View flex={1}>
        <ScrollableContent>
          <Title>{item.title}</Title>
          <View padding={[16, 12]}>
            <Task {...this.props} body={item.body} comments={item.data.comments} />
          </View>
        </ScrollableContent>
        <BitStatusBar {...this.props} />
      </View>
    )
  }
}
