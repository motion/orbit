import { view, react, attach } from '@mcro/black'
import * as React from 'react'
import { Source } from '@mcro/models'
import { AppConfig } from '@mcro/stores'
import { TitleBarButton } from '../layout/TitleBarButton'
import { ScrollableContent } from '../layout/ScrollableContent'
import { HideablePane } from '../../../views/HideablePane'
import { getAppFromSource } from '../../../stores/SourcesStore'
import { AppHeader } from '../layout/AppHeader'

type Props = {
  appViewStore?: AppViewStore
  source: Source
  settingsPane: React.ReactNode
  initialState: AppConfig['viewConfig']['initialState']
}

export class AppViewStore {
  props: Props

  active = 'topics'
  lastActive = 'topics'

  setter = key => () => {
    this.setActiveKey(key)
  }

  setActiveKey = key => {
    console.log('got active key', key)
    this.lastActive = this.active
    this.active = key
  }

  updateTab = react(() => (this.props.initialState || {}).active || 'topics', this.setActiveKey)

  activeToggler = key => () => {
    console.log('got toggle key', key)
    if (key === this.active) {
      this.setActiveKey(this.lastActive)
    } else {
      this.setActiveKey(key)
    }
  }
}

@attach({
  appViewStore: AppViewStore,
})
@view
export class SimpleAppExplorer extends React.Component<Props> {
  render() {
    const { source, settingsPane, appViewStore } = this.props
    const app = getAppFromSource(source)
    return (
      <>
        <AppHeader
          before={
            <>
              {app.appName} - {app.display.name}
            </>
          }
          after={
            <TitleBarButton
              tooltip="Settings"
              icon="gear"
              onClick={appViewStore.activeToggler('sources')}
              active={appViewStore.active === 'sources'}
            />
          }
        />
        <ScrollableContent>
          <HideablePane invisible={appViewStore.active !== 'sources'}>{settingsPane}</HideablePane>
        </ScrollableContent>
      </>
    )
  }
}
