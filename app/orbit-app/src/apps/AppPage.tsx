import * as React from 'react'
import { view } from '@mcro/black'
import { Peek } from './peek/Peek'
import { AppStore } from './AppStore'
import { AppsStore } from './AppsStore'
import { MainShortcutHandler } from '../components/shortcutHandlers/MainShortcutHandler'
import { AppWrapper } from '../views'
import { APP_ID } from '../constants'

@view.provide({
  appsStore: AppsStore,
  appStore: AppStore,
})
export class AppPage extends React.Component<{
  appsStore: AppsStore
  appStore: AppStore
}> {
  render() {
    console.log('app id', APP_ID)
    return (
      <MainShortcutHandler>
        <AppWrapper>
          <Peek id={APP_ID} />
        </AppWrapper>
      </MainShortcutHandler>
    )
  }
}
