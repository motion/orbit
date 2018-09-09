import * as React from 'react'
import { view } from '@mcro/black'
import { Peek } from './peek/Peek'
import { AppStore } from './AppStore'
import { AppsStore } from './AppsStore'
import { MainShortcutHandler } from '../components/shortcutHandlers/MainShortcutHandler'
import { AppWrapper } from '../views'

@view.provide({
  appsStore: AppsStore,
  appStore: AppStore,
})
export class AppPage extends React.Component<{
  appsStore: AppsStore
  appStore: AppStore
}> {
  render() {
    return (
      <MainShortcutHandler>
        <AppWrapper>
          <Peek />
        </AppWrapper>
      </MainShortcutHandler>
    )
  }
}
