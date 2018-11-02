import * as React from 'react'
import { view, attach, provide } from '@mcro/black'
import { AppStore } from './AppStore'
import { apps, AppType } from './apps'
import { SourcesStore } from '../stores/SourcesStore'
import { SettingStore } from '../stores/SettingStore'

type Props = {
  id: string
  title: string
  type: AppType
  appStore?: AppStore
  sourcesStore?: SourcesStore
  settingStore?: SettingStore
}

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
export class App extends React.Component<Props> {
  render() {
    const { type, appStore, sourcesStore, settingStore } = this.props
    const App = apps[type]
    return (
      <App
        appStore={appStore}
        sourcesStore={sourcesStore}
        settingStore={settingStore}
        {...this.props}
      />
    )
  }
}
