import * as React from 'react'
import { OrbitAppMainProps } from '../../../types'
import { ScrollableContent } from '../../../views/layout/ScrollableContent'
import { View } from '@mcro/ui'
import { AppStatusBar } from '../../../views/layout/AppStatusBar'
import { BitTitleBar } from '../../../views/layout/BitTitleBar'
import { Task } from '../../../views/bits/task/Task'

export class GithubApp extends React.Component<OrbitAppMainProps<'github'>> {
  render() {
    const { bit } = this.props
    return (
      <View padding={16} flex={1}>
        <BitTitleBar {...this.props} />
        <ScrollableContent>
          <View padding={[16, 0]}>
            <Task body={bit.body} comments={bit.data.comments} />
          </View>
        </ScrollableContent>
        <AppStatusBar {...this.props} />
      </View>
    )
  }
}
