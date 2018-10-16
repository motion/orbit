import * as React from 'react'
import { view } from '@mcro/black'
import { OrbitStore } from './OrbitStore'
import { AppsStore } from '../../stores/AppsStore'
import { MainShortcutHandler } from '../../components/shortcutHandlers/MainShortcutHandler'
import { AppWrapper } from '../../views'
import { KeyboardStore } from '../../stores/KeyboardStore'
import { HighlightsPage } from '../HighlightsPage/HighlightsPage'
import { QueryStore } from './orbitDocked/QueryStore'
import { SelectionStore } from './orbitDocked/SelectionStore'
import { OrbitDocked } from './orbitDocked/OrbitDocked'

@view.provide({
  appsStore: AppsStore,
  orbitStore: OrbitStore,
})
@view.provide({
  queryStore: QueryStore,
  keyboardStore: KeyboardStore,
})
@view.provide({
  selectionStore: SelectionStore,
})
export class OrbitPage extends React.Component<{
  appsStore: AppsStore
  orbitStore: OrbitStore
}> {
  render() {
    return (
      <MainShortcutHandler>
        <AppWrapper>
          <HighlightsPage />
          <OrbitDocked />
        </AppWrapper>
      </MainShortcutHandler>
    )
  }
}
