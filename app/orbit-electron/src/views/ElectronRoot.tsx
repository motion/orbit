import { App } from '@mcro/reactron'
import { view } from '@mcro/black'
import * as React from 'react'
import Tray from './Tray'
import { MenuItems } from './MenuItems'
import { OrbitWindow } from './OrbitWindow'
import { ElectronStore } from '../stores/ElectronStore'
import { AppWindows } from './AppWindows'

@view.provide({
  electronStore: ElectronStore,
})
@view.electron
export class ElectronRoot extends React.Component {
  props: {
    electronStore?: ElectronStore
  }

  componentDidCatch(error) {
    this.props.electronStore.error = error
    console.log('electron error', error)
  }

  render() {
    const { electronStore } = this.props
    if (electronStore.error) {
      if (electronStore.error) {
        console.log('error is', electronStore.error)
      }
      return null
    }
    console.log('electron success, rendering...')
    let devTools = null
    if (process.env.NODE_ENV === 'development') {
      const tools = require('@mcro/reactron/devtools')
      devTools = [tools.mobx, tools.react]
    }
    return (
      <App
        onBeforeQuit={electronStore.handleBeforeQuit}
        onWillQuit={electronStore.handleQuit}
        ref={electronStore.handleAppRef}
        devTools={devTools}
      >
        <MenuItems />
        <OrbitWindow />
        <AppWindows />
        <Tray />
      </App>
    )
  }
}
