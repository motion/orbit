import * as React from 'react'
import { App as AppWindow } from '@mcro/reactron'
import { view, debugState } from '@mcro/black'
import Tray from './views/Tray'
import MenuItems from './views/MenuItems'
import HighlightsWindow from './views/HighlightsWindow'
import PeekWindow from './views/PeekWindow'
import OrbitWindow from './views/OrbitWindow'
import ShortcutsStore from '~/stores/shortcutsStore'
// import SettingsWindow from './views/SettingsWindow'
import * as Helpers from '~/helpers'
import { App, Electron, Desktop } from '@mcro/all'
import global from 'global'
import { debounce } from 'lodash'

const log = debug('Electron')

@view.provide({
  electron: class ElectronStore {
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
      Electron.start()
      Electron.setState({ settingsPosition: Helpers.getAppSize().position })
      this.watchOptionPress()
    }

    watchOptionPress = () => {
      new ShortcutsStore().emitter.on('shortcut', shortcut => {
        if (shortcut === 'Option+Space') {
          log(`got option+space`)
          // if were holding peek
          if (
            Desktop.isHoldingOption &&
            !Electron.orbitState.pinned &&
            !App.state.orbitHidden
          ) {
            log('avoid toggle. TODO: make this "pin" it open')
            return
          }
          this.togglePinned()
        }
      })

      // peek behavior
      let optnEnter
      this.react(
        () => Desktop.isHoldingOption,
        debounce(isHoldingOption => {
          clearTimeout(optnEnter)
          if (Electron.orbitState.pinned) {
            log(`pinned, avoid`)
            return
          }
          if (!isHoldingOption) {
            // TODO
            if (!Electron.orbitState.pinned && Electron.orbitState.focused) {
              log('prevent hide while mouseover after release hold')
              return
            }
            log('shouldHide')
            Electron.setState({ shouldHide: Date.now(), lastAction: null })
            return
          }
          if (App.state.orbitHidden) {
            // SHOW
            optnEnter = setTimeout(() => {
              log('shouldShow')
              this.appRef.show()
              Electron.setState({ shouldShow: Date.now() })
            }, 150)
          }
        }, 16),
      )
    }

    restart() {
      if (process.env.NODE_ENV === 'development') {
        require('touch')(
          require('path').join(__dirname, '..', 'lib', 'index.js'),
        )
      }
    }

    togglePinned = async () => {
      if (!this.appRef) {
        throw new Error('No appRef')
      }
      const pinned = !Electron.orbitState.pinned
      Electron.setOrbitState({ pinned, focused: pinned })
      if (pinned) {
        this.appRef.focus()
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
    console.error(error)
    this.props.electron.error = error
  }

  render({ electron }) {
    if (electron.error) {
      return null
    }

    return (
      <AppWindow
        onBeforeQuit={electron.handleBeforeQuit}
        onQuit={electron.handleQuit}
        ref={electron.handleAppRef}
      >
        <MenuItems />
        <HighlightsWindow />
        <PeekWindow />}
        <OrbitWindow />
        {/* <SettingsWindow /> */}
        <Tray />
      </AppWindow>
    )
  }
}
