import { App } from '@mcro/reactron'
import { view, provide } from '@mcro/black'
import * as React from 'react'
import { ElectronStore } from '../stores/ElectronStore'
import { devTools } from '../helpers/devTools'
import { ChromeWindow } from './ChromeWindow'
import { AppWindows } from './AppWindows'

@provide({
  electronStore: ElectronStore,
})
@view
export class ChromeRoot extends React.Component {
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
    return (
      <App
        onBeforeQuit={electronStore.handleBeforeQuit}
        onWillQuit={electronStore.handleQuit}
        ref={electronStore.handleAppRef}
        devTools={devTools}
      >
        <ChromeWindow />
        <AppWindows />
      </App>
    )
  }
}
