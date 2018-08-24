import { PeekStore } from './stores/PeekStore'
import * as React from 'react'
import { view, compose } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as PeekPanes from './panes'
import { capitalize } from 'lodash'
import { PeekFrame } from './views/PeekFrame'
import { AppStore } from '../../stores/AppStore'
import { PeekContent } from './views/PeekContent'
import { PeekHeader } from './views/PeekHeader'
import { SelectionStore } from '../../stores/SelectionStore'
import { PeekPaneProps, PeekContents } from './PeekPaneProps'

type Props = {
  appStore?: AppStore
  peekStore?: PeekStore
  selectionStore?: SelectionStore
}

const decorator = compose(
  view.attach('appStore', 'searchStore'),
  view.provide({
    peekStore: PeekStore,
  }),
)

export const Peek = decorator(
  ({ appStore, selectionStore, peekStore }: Props) => {
    return (
      <UI.Theme name="light">
        <PeekFrame>
          <PeekPageInner
            appStore={appStore}
            selectionStore={selectionStore}
            peekStore={peekStore}
          />
        </PeekFrame>
      </UI.Theme>
    )
  },
)

type PeekPane = React.SFC<PeekPaneProps>

@view
class PeekPageInner extends React.Component<Props> {
  render() {
    const { peekStore, appStore, selectionStore } = this.props
    if (!peekStore.state) {
      return null
    }
    const { item, model } = peekStore.state
    const type = (item && capitalize(item.type)) || 'Empty'
    const PeekContentsView = PeekPanes[type] as PeekPane
    if (type === 'Bit' || type === 'Person') {
      if (!model) {
        console.error('no model?', model)
        return null
      }
    }
    if (!PeekContentsView) {
      console.error('none', type)
      return <div>no pane found</div>
    }
    console.log('render peek page', model, type)
    return (
      <PeekContentsView
        key={(model && model.id) || item.id || Math.random()}
        item={item}
        model={model}
        appStore={appStore}
        peekStore={peekStore}
        selectionStore={selectionStore}
      >
        {(resolvedProps: PeekContents) => {
          const {
            preBody,
            postBody,
            content,
            headerProps,
            ...restResolvedProps
          } = resolvedProps
          return (
            <>
              <PeekHeader {...restResolvedProps} {...headerProps} />
              {preBody}
              <PeekContent peekStore={peekStore}>{content}</PeekContent>
              {postBody}
            </>
          )
        }}
      </PeekContentsView>
    )
  }
}
