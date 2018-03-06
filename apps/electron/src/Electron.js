import * as React from 'react'
import { App as AppWindow } from '@mcro/reactron'
import ShortcutsStore from '~/stores/shortcutsStore'
import { view, debugState } from '@mcro/black'
import Tray from './views/Tray'
import MenuItems from './views/MenuItems'
import HighlightsWindow from './views/HighlightsWindow'
import PeekWindow from './views/PeekWindow'
import SettingsWindow from './views/SettingsWindow'
import * as Helpers from '~/helpers'
import Screen, { App, Electron, Desktop } from '@mcro/screen'
import global from 'global'
import { screen } from 'electron'
import { debounce } from 'lodash'

const log = debug('Electron')

@view.provide({
  electron: class ElectronStore {
    error = null
    appRef = null
    stores = null
    views = null

    willMount() {
      global.App = this
      debugState(({ stores, views }) => {
        this.stores = stores
        this.views = views
      })

      // setup screen
      const { position } = Helpers.getAppSize()
      const screenSize = screen.getPrimaryDisplay().workAreaSize

      console.log('STARTING SCREEN')

      Screen.start('electron', {
        shouldHide: null,
        shouldShow: null,
        shouldPause: null,
        peekState: {},
        showSettings: false,
        peekFocused: false,
        showDevTools: {
          app: false,
          peek: false,
          highlights: false,
          settings: true,
        },
        lastMove: Date.now(),
        settingsPosition: position,
        screenSize,
      })

      this.watchOptionPress()
    }

    watchOptionPress = () => {
      // watch option hold
      this.lastToggle = Date.now()

      new ShortcutsStore().emitter.on('shortcut', shortcut => {
        console.log('emit shortcut', shortcut)
        if (shortcut === 'Option+Space') {
          // if (Desktop.state.keyboard.option) {
          //   console.log('avoid toggle while holding option')
          //   return
          // }
          this.lastToggle = Date.now()
          console.log('got a toggle')
          this.toggleShown()
        }
      })

      this.react(
        () => [Desktop.state.keyboard.option, Desktop.state.keyboard.optionUp],
        this.handleOptionKey,
      )
    }

    // debounced so it comes after toggles
    handleOptionKey = debounce(([option, optionUp]) => {
      clearTimeout(this.optnEnter)
      // just toggled, ignore this
      if (this.lastToggle > option) {
        log(`just toggled, avoid option handle`)
        return
      }
      const isHolding = option > optionUp
      log(
        `handleOptionKey option (${option}) optionUp (${optionUp}) isHolding (${isHolding}) peekHidden (${
          App.state.peekHidden
        })`,
      )
      if (!isHolding) {
        if (Electron.state.peekFocused) {
          log('mouse is over peek, dont hide')
        }
        this.hideOra()
        return
      }
      if (App.state.peekHidden) {
        // SHOW
        this.optnEnter = setTimeout(this.showOra, 150)
      }
    }, 16)

    restart() {
      if (process.env.NODE_ENV === 'development') {
        require('touch')(
          require('path').join(__dirname, '..', 'lib', 'index.js'),
        )
      }
    }

    toggleShown = async () => {
      if (App.state.pinned) return
      if (!this.appRef) return
      if (!App.state.peekHidden) {
        this.hideOra()
      } else {
        this.showOra()
        this.appRef.focus()
      }
    }

    async showOra() {
      log('showOra')
      this.appRef.show()
      Electron.setState({ shouldShow: Date.now() })
    }

    async hideOra() {
      log('hideOra')
      Electron.setState({ shouldHide: Date.now() })
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
        <PeekWindow />
        {/* <SettingsWindow /> */}
        <Tray />
      </AppWindow>
    )
  }
}
