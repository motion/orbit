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
    const id = +window.location.search.match(/id=([0-9]+)/)[1]
    console.log('app id', id)
    return (
      <MainShortcutHandler>
        <AppWrapper>
          <Peek id={id} />
        </AppWrapper>
      </MainShortcutHandler>
    )
  }
}
