import * as React from 'react'
import { view } from '@mcro/black'
import { AppsStore } from '../../stores/AppsStore'
import { MainShortcutHandler } from '../../components/shortcutHandlers/MainShortcutHandler'
import { AppWrapper } from '../../views'
import { AppStore } from './AppStore'
import * as UI from '@mcro/ui'
import { SelectionStore } from '../OrbitPage/orbitDocked/SelectionStore'
import { AppFrame } from './AppFrame'

// import { PeekContent } from '../../apps/views/PeekContent'
// import { PeekHeader } from '../../apps/views/PeekHeader'
// import { PeekContents } from './PeekPaneProps'
// renderResolvedContent = (resolvedProps: PeekContents) => {
//   const { preBody, postBody, content, headerProps } = resolvedProps
//   return (
//     <>
//       <PeekHeader {...headerProps} />
//       {preBody}
//       <PeekContent appStore={this.props.appStore}>{content}</PeekContent>
//       {postBody}
//     </>
//   )
// }

type Props = {
  appsStore?: AppsStore
  appStore?: AppStore
  selectionStore?: SelectionStore
}

@view.attach('searchStore')
@view.provide({
  appsStore: AppsStore,
})
@view.provide({
  appStore: AppStore,
})
export class AppPage extends React.Component<Props> {
  render() {
    return (
      <MainShortcutHandler>
        <AppWrapper>
          <UI.Theme name="light">
            <AppFrame>
              <AppPageContent />
            </AppFrame>
          </UI.Theme>
        </AppWrapper>
      </MainShortcutHandler>
    )
  }
}

@view.attach('appsStore', 'appStore')
@view
class AppPageContent extends React.Component<Props> {
  render() {
    const { appsStore, appStore } = this.props
    if (!appStore.state) {
      return null
    }
    const { appConfig, model } = appStore.state
    const type = appConfig.type

    switch (type) {
      case 'bit':
        const app = appsStore.allAppsObj[appConfig.integration]
        if (!app) {
          console.log('no app', type, appConfig, appStore)
          return null
        }
        const View = app.views.main
        return <View key={appConfig.id} model={model} appStore={appStore} />
      case 'person-bit':
      // return <PeekPer
      case 'setting':
      default:
        return <div>invalid type found {type}</div>
    }
  }
}
