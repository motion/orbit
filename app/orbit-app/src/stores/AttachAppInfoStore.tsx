import * as React from 'react'
import { AppInfoStore } from '../stores/AppInfoStore'
import { attach, provide } from '@mcro/black'

@attach('appStore', 'appsStore')
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
