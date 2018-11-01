import * as React from 'react'
import { AppInfoStore } from './AppInfoStore'
import { attach, provide } from '@mcro/black'

@attach('viewStore', 'sourcesStore')
@provide({
  appInfoStore: AppInfoStore,
})
export class AttachAppInfoStore extends React.Component<{
  appInfoStore?: AppInfoStore
  children: (a: AppInfoStore) => React.ReactNode
}> {
  render() {
    return this.props.children(this.props.appInfoStore)
  }
}
