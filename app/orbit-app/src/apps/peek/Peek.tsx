import { PeekStore } from './stores/PeekStore'
import * as React from 'react'
import { view, compose } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as PeekPanes from './panes'
import { capitalize } from 'lodash'
import { PeekFrame } from './views/PeekFrame'
import { PeekContent } from './views/PeekContent'
import { PeekHeader } from './views/PeekHeader'
import { SelectionStore } from '../orbit/orbitDocked/SelectionStore'
import { PeekPaneProps, PeekContents } from './PeekPaneProps'

type Props = {
  peekStore?: PeekStore
  selectionStore?: SelectionStore
}

const decorator = compose(
  view.attach('searchStore'),
  view.provide({
    peekStore: PeekStore,
  }),
)

export const Peek = decorator(({ selectionStore, peekStore }: Props) => {
  return (
    <UI.Theme name="light">
      <PeekFrame>
        <PeekPageInner selectionStore={selectionStore} peekStore={peekStore} />
      </PeekFrame>
    </UI.Theme>
  )
})

type PeekPane = React.SFC<PeekPaneProps<any>>

@view
class PeekPageInner extends React.Component<Props> {
  render() {
    const { peekStore, selectionStore } = this.props
    if (!peekStore.state) {
      return null
    }
    const { appConfig, model } = peekStore.state
    const type = (appConfig && capitalize(appConfig.type)) || 'Empty'
    const PeekContentsView = PeekPanes[type] as PeekPane
    if (!PeekContentsView) {
      console.error('none', type)
      return <div>no pane found</div>
    }
    return (
      <PeekContentsView
        key={appConfig.id}
        model={model}
        appConfig={appConfig}
        peekStore={peekStore}
        selectionStore={selectionStore}
      >
        {this.renderResolvedContent}
      </PeekContentsView>
    )
  }

  renderResolvedContent = (resolvedProps: PeekContents) => {
    const { preBody, postBody, content, headerProps, ...restResolvedProps } = resolvedProps
    return (
      <>
        <PeekHeader {...restResolvedProps} {...headerProps} />
        {preBody}
        <PeekContent peekStore={this.props.peekStore}>{content}</PeekContent>
        {postBody}
      </>
    )
  }
}
