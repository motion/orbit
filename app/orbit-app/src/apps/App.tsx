import * as React from 'react'
import { view, attach, provide } from '@mcro/black'
import { AppStore } from './AppStore'
import { apps } from './apps'

@attach('sourcesStore', 'queryStore', 'subPaneStore')
@provide({
  appStore: AppStore,
})
@view
export class App extends React.Component<{ title: string; type: string }> {
  render() {
    const { type } = this.props
    const App = apps[type]
    return <App {...this.props} />
  }
}
