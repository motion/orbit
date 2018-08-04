import { App as AppWindow, DevTools } from '@mcro/reactron'
import { view } from '@mcro/black'
import * as React from 'react'
import Tray from './Tray'
import { MenuItems } from './MenuItems'
import { MainWindow } from './MainWindow'
import { ElectronStore } from '../stores/ElectronStore'

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
    if (!electronStore.windowFocusStore) {
      console.log('no window focus store')
      return null
    }
    if (electronStore.error) {
      if (electronStore.error) {
        console.log('error is', electronStore.error)
      }
      return null
    }
    console.log('electron success, rendering...')
    return (
      <AppWindow
        onBeforeQuit={electronStore.handleBeforeQuit}
        onQuit={electronStore.handleQuit}
        ref={electronStore.handleAppRef}
        devTools={[DevTools.mobx, DevTools.react]}
      >
        <MenuItems />
        <MainWindow onRef={electronStore.windowFocusStore.setOrbitRef} />
        <Tray />
      </AppWindow>
    )
  }
}
