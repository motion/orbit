import { App as AppWindow } from '@mcro/reactron'
import { view } from '@mcro/black'
import * as React from 'react'
import Tray from './views/Tray'
import MenuItems from './views/MenuItems'
import MainWindow from './views/MainWindow'
import { ElectronStore } from '~/stores/ElectronStore'

@view.provide({
  electronStore: ElectronStore,
})
@view.electron
export class Electron extends React.Component {
  props: {
    electronStore: ElectronStore
  }

  componentDidCatch(error) {
    this.props.electronStore.error = error
    console.error(error)
  }

  render({ electronStore }) {
    if (electronStore.error) {
      return null
    }
    if (!electronStore.windowFocusStore) {
      return null
    }
    return (
      <AppWindow
        onBeforeQuit={electronStore.handleBeforeQuit}
        onQuit={electronStore.handleQuit}
        ref={electronStore.handleAppRef}
      >
        <MenuItems el />
        <MainWindow onRef={electronStore.windowFocusStore.setOrbitRef} />
        <Tray />
      </AppWindow>
    )
  }
}
