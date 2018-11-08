import * as React from 'react'
import { view, attach, provide } from '@mcro/black'
import { AppStore } from './AppStore'
import { apps } from './apps'
import { trace } from 'mobx'
import { AppProps } from './AppProps'

@attach(
  'paneManagerStore',
  'selectionStore',
  'sourcesStore',
  'queryStore',
  'subPaneStore',
  'settingStore',
)
@provide({
  appStore: AppStore,
})
@view
export class AppView extends React.Component<AppProps> {
  render() {
    const {
      view,
      type,
      appStore,
      sourcesStore,
      settingStore,
      queryStore,
      subPaneStore,
    } = this.props
    trace()
    const App = apps[type][view]
    if (typeof App !== 'function') {
      console.error('WAHT THE FUCK', type, App)
      return null
    }
    return (
      <App
        appStore={appStore}
        sourcesStore={sourcesStore}
        settingStore={settingStore}
        subPaneStore={subPaneStore}
        queryStore={queryStore}
        {...this.props}
      />
    )
  }
}
