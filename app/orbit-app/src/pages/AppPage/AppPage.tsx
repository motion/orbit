import * as React from 'react'
import { view } from '@mcro/black'
import { AppsStore } from '../../stores/AppsStore'
import { MainShortcutHandler } from '../../components/shortcutHandlers/MainShortcutHandler'
import { AppWrapper } from '../../views'
import { PeekStore } from './AppStore'
import {} from '@mcro/black'
import * as UI from '@mcro/ui'
import { PeekFrame } from '../../apps/views/PeekFrame'
import { SelectionStore } from '../OrbitPage/orbitDocked/SelectionStore'

// import { PeekContent } from '../../apps/views/PeekContent'
// import { PeekHeader } from '../../apps/views/PeekHeader'
// import { PeekContents } from './PeekPaneProps'
// renderResolvedContent = (resolvedProps: PeekContents) => {
//   const { preBody, postBody, content, headerProps } = resolvedProps
//   return (
//     <>
//       <PeekHeader {...headerProps} />
//       {preBody}
//       <PeekContent peekStore={this.props.peekStore}>{content}</PeekContent>
//       {postBody}
//     </>
//   )
// }

type Props = {
  appsStore?: AppsStore
  peekStore?: PeekStore
  selectionStore?: SelectionStore
}

@view.attach('searchStore')
@view.provide({
  appsStore: AppsStore,
})
@view.provide({
  peekStore: PeekStore,
})
export class AppPage extends React.Component<Props> {
  render() {
    return (
      <MainShortcutHandler>
        <AppWrapper>
          <UI.Theme name="light">
            <PeekFrame>
              <AppPageContent />
            </PeekFrame>
          </UI.Theme>
        </AppWrapper>
      </MainShortcutHandler>
    )
  }
}

@view.attach('appsStore', 'selectionStore', 'peekStore')
@view
class AppPageContent extends React.Component<Props> {
  render() {
    const { appsStore, peekStore, selectionStore } = this.props
    if (!peekStore.state) {
      return null
    }
    const { appConfig, model } = peekStore.state
    const type = appConfig.type
    const View = appsStore.allAppsObj[type].views.main
    if (!View) {
      console.error('none', type)
      return <div>no pane found</div>
    }
    return (
      <View
        key={appConfig.id}
        model={model}
        appConfig={appConfig}
        peekStore={peekStore}
        selectionStore={selectionStore}
      />
    )
  }
}
