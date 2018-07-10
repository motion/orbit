import { PeekStore } from './PeekStore'
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as PeekContents from './peek/PeekContents'
import { capitalize } from 'lodash'
import { PeekFrame } from './peek/PeekFrame'
import { AppStore } from '../stores/AppStore'

const PeekPageInner = view(({ peekStore, appStore }) => {
  if (!peekStore.state) {
    return null
  }
  const { item, peekId } = peekStore.state
  const type = (item && capitalize(item.type)) || 'Empty'
  const PeekContentsView = PeekContents[type]
  if (!PeekContentsView) {
    console.error('none', type)
    return <div>no pane found</div>
  }
  if (!peekStore.model) {
    console.warn('no selected model')
    return <div>no selected model</div>
  }
  return (
    <PeekContentsView
      key={peekId}
      bit={peekStore.model}
      person={peekStore.model}
      appStore={appStore}
      peekStore={peekStore}
    />
  )
})

@view.attach('appStore')
@view.provide({
  peekStore: PeekStore,
})
export class PeekPage extends React.Component {
  props: {
    appStore: AppStore
    peekStore: PeekStore
  }

  render() {
    const { appStore, peekStore } = this.props
    return (
      <UI.Theme name="light">
        <PeekFrame>
          <PeekPageInner appStore={appStore} peekStore={peekStore} />
        </PeekFrame>
      </UI.Theme>
    )
  }
}
