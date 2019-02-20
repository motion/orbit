import { View } from '@mcro/ui'
import * as React from 'react'
import { SectionTitle } from '../../../../views/Section'
import { OrbitSourceMainProps } from '../../../types'
import { Task } from '../../../views/bits/task/Task'
import { BitStatusBar } from '../../../views/layout/BitStatusBar'
import ScrollableContent from '../../../views/layout/ScrollableContent'

export class GithubApp extends React.Component<OrbitSourceMainProps<'github'>> {
  render() {
    const { item } = this.props
    return (
      <View flex={1}>
        <ScrollableContent>
          <SectionTitle>{item.title}</SectionTitle>
          <View padding={[16, 12]}>
            <Task {...this.props} body={item.body} comments={item.data.comments} />
          </View>
        </ScrollableContent>
        <BitStatusBar {...this.props} />
      </View>
    )
  }
}
