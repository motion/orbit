import { App as AppWindow, DevTools } from '@mcro/reactron'
import { view, Component } from '@mcro/black'
import * as React from 'react'
import Tray from './views/Tray'
import { MenuItems } from './views/MenuItems'
import { MainWindow } from './views/MainWindow'
import { ElectronStore } from './stores/ElectronStore'

@view.provide({
  electronStore: ElectronStore,
})
@view.electron
export class Electron extends Component {
  props: {
    electronStore: ElectronStore
  }

  componentDidCatch(error) {
    this.props.electronStore.error = error
    console.error(error)
  }

  render({ electronStore }) {
    if (electronStore.error || !electronStore.windowFocusStore) {
      console.log('ran into error', electronStore.error)
      return null
    }
    return (
      <AppWindow
        onBeforeQuit={electronStore.handleBeforeQuit}
        onQuit={electronStore.handleQuit}
        ref={electronStore.handleAppRef}
        devTools={[DevTools.mobx]}
      >
        <MenuItems el />
        <MainWindow onRef={electronStore.windowFocusStore.setOrbitRef} />
        <Tray />
      </AppWindow>
    )
  }
}
