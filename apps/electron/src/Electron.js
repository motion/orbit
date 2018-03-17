import { Electron, Desktop } from '@mcro/all'
import { App as AppWindow } from '@mcro/reactron'
import { view, debugState } from '@mcro/black'
import * as React from 'react'
import Tray from './views/Tray'
import MenuItems from './views/MenuItems'
import HighlightsWindow from './views/HighlightsWindow'
import PeekWindow from './views/PeekWindow'
import OrbitWindow from './views/OrbitWindow'
import ShortcutsStore from '~/stores/shortcutsStore'
// import SettingsWindow from './views/SettingsWindow'
import * as Helpers from '~/helpers'
import global from 'global'

const log = debug('Electron')

@view.provide({
  electronStore: class ElectronStore {
    error = null
    appRef = null
    stores = null
    views = null

    willMount() {
      global.Root = this
      global.restart = this.restart
      debugState(({ stores, views }) => {
        this.stores = stores
        this.views = views
      })
      Electron.start({
        ignoreSelf: true,
      })
      Electron.setState({ settingsPosition: Helpers.getAppSize().position })
      this.watchOptionPress()

      // focus on pinned
      this.react(
        () => Electron.orbitState.pinned,
        pinned => pinned && this.appRef.focus(),
      )

      // show on show
      this.react(
        () => Electron.state.shouldShow,
        shouldShow => shouldShow && this.appRef.show(),
      )
    }

    watchOptionPress = () => {
      this.shortcutStore = new ShortcutsStore([
        'Option+Space',
        'Option+Shift+Space',
      ])

      this.shortcutStore.emitter.on('shortcut', Electron.onShortcut)
    }

    restart() {
      if (process.env.NODE_ENV === 'development') {
        require('touch')(
          require('path').join(__dirname, '..', 'lib', 'index.js'),
        )
      }
    }

    handleAppRef = ref => ref && (this.appRef = ref.app)
    handleBeforeQuit = () => console.log('before quit')
    handleQuit = () => {
      console.log('handling quit')
      process.exit(0)
    }
  },
})
@view.electron
export default class ElectronWindow extends React.Component {
  componentDidCatch(error) {
    this.props.electronStore.error = error
    console.error(error)
  }

  render({ electronStore }) {
    if (electronStore.error) {
      return null
    }

    return (
      <AppWindow
        onBeforeQuit={electronStore.handleBeforeQuit}
        onQuit={electronStore.handleQuit}
        ref={electronStore.handleAppRef}
      >
        <MenuItems />
        {/* <HighlightsWindow /> */}
        <PeekWindow />}
        <OrbitWindow />
        {/* <SettingsWindow /> */}
        <Tray />
      </AppWindow>
    )
  }
}
