import * as React from 'react'
import { OrbitSourceMainProps } from '../../../types'
import { ScrollableContent } from '../../../views/layout/ScrollableContent'
import { View } from '@mcro/ui'
import { BitStatusBar } from '../../../views/layout/BitStatusBar'
import { Task } from '../../../views/bits/task/Task'

export class GithubApp extends React.Component<OrbitSourceMainProps<'github'>> {
  render() {
    const { bit } = this.props
    return (
      <View padding={16} flex={1}>
        <ScrollableContent>
          <View padding={[16, 0]}>
            <Task {...this.props} body={bit.body} comments={bit.data.comments} />
          </View>
        </ScrollableContent>
        <BitStatusBar {...this.props} />
      </View>
    )
  }
}
