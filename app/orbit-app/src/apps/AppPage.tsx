import * as React from 'react'
import { view } from '@mcro/black'
import { Peek } from './peek/Peek'
import { AppsStore } from './AppsStore'
import { MainShortcutHandler } from '../components/shortcutHandlers/MainShortcutHandler'
import { AppWrapper } from '../views'
import { APP_ID } from '../constants'

@view.provide({
  appsStore: AppsStore,
})
export class AppPage extends React.Component<{
  appsStore: AppsStore
}> {
  render() {
    return (
      <MainShortcutHandler>
        <AppWrapper>
          <Peek id={APP_ID} />
        </AppWrapper>
      </MainShortcutHandler>
    )
  }
}
