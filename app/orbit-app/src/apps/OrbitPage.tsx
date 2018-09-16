import * as React from 'react'
import { view } from '@mcro/black'
import { OrbitStore } from './OrbitStore'
import { AppsStore } from './AppsStore'
import { MainShortcutHandler } from '../components/shortcutHandlers/MainShortcutHandler'
import { AppWrapper } from '../views'
import { OrbitDocked } from './orbit/orbitDocked/OrbitDocked'
import { QueryStore } from './orbit/orbitDocked/QueryStore'
import { KeyboardStore } from '../stores/KeyboardStore'
import { SelectionStore } from './orbit/orbitDocked/SelectionStore'

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
          <OrbitDocked />
        </AppWrapper>
      </MainShortcutHandler>
    )
  }
}
