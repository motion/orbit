import * as React from 'react'
import { App } from '@mcro/reactron'
import ShortcutsStore from '~/stores/shortcutsStore'
import { view, debugState } from '@mcro/black'
import Tray from './views/Tray'
import MenuItems from './views/MenuItems'
import HighlightsWindow from './views/HighlightsWindow'
import PeekWindow from './views/PeekWindow'
import SettingsWindow from './views/SettingsWindow'
import * as Helpers from '~/helpers'
import Screen from '@mcro/screen'
import global from 'global'
import { screen } from 'electron'

@view.provide({
  electron: class ElectronStore {
    error = null
    appRef = null
    oraRef = null
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

      new ShortcutsStore().emitter.on('shortcut', shortcut => {
        console.log('emit shortcut', shortcut)
        if (shortcut === 'Option+Space') {
          if (Screen.desktopState.keyboard.option) {
            console.log('avoid toggle while holding option')
            return
          }
          this.toggleShown()
        }
      })

      this.watchOptionPress()
    }

    watchOptionPress = () => {
      // watch option hold
      let lastKeyboard = {}
      let justCleared = false
      let optnEnter
      let optnLeave
      this.react(() => Screen.desktopState.keyboard, function reactToKeyboard(
        keyboard,
      ) {
        if (!keyboard) return
        clearTimeout(optnLeave)
        const { option, optionCleared } = keyboard
        if (Screen.appState.peekHidden) {
          // HIDDEN
          // clear last if not opened yet
          if (optionCleared) {
            clearTimeout(optnEnter)
          }
          // delay before opening on option
          if (!lastKeyboard.option && option) {
            optnEnter = setTimeout(this.showOra, 150)
          }
        } else {
          // SHOWN
          // dont toggle
          if (optionCleared) {
            justCleared = true
            return
          }
          // for some reason an option event comes again
          // after it just cleared (saying its false), so ignore
          if (justCleared) {
            justCleared = false
            return
          }
          // dont hide if mouse is currently on window
          if (Screen.electronState.peekFocused) {
            console.log('mouse is over peek, dont hide')
            return
          }
          if (lastKeyboard.option && !option) {
            optnLeave = setTimeout(this.hideOra, 40)
          }
        }
        lastKeyboard = keyboard
      })
    }

    restart() {
      if (process.env.NODE_ENV === 'development') {
        require('touch')(
          require('path').join(__dirname, '..', 'lib', 'index.js'),
        )
      }
    }

    toggleShown = async () => {
      if (Screen.appState.pinned) return
      if (!this.appRef) return
      if (!Screen.appState.peekHidden) {
        this.hideOra()
      } else {
        this.showOra()
      }
    }

    async showOra() {
      this.appRef.show()
      Screen.setState({ shouldShow: Date.now() })
    }

    async hideOra() {
      Screen.setState({ shouldHide: Date.now() })
    }

    handleAppRef = ref => ref && (this.appRef = ref.app)
    handleOraRef = ref => (this.oraRef = ref)
    handleBeforeQuit = () => console.log('before quit')
    handleQuit = () => {
      console.log('handling quit')
      process.exit(0)
    }
  },
})
@view.electron
export default class Electron extends React.Component {
  componentDidCatch(error) {
    console.error(error)
    this.props.electron.error = error
  }

  render({ electron }) {
    if (electron.error) {
      return null
    }
    return (
      <App
        onBeforeQuit={electron.handleBeforeQuit}
        onQuit={electron.handleQuit}
        ref={electron.handleAppRef}
      >
        <MenuItems />
        <HighlightsWindow />
        <PeekWindow />
        {/* <SettingsWindow /> */}
        <Tray />
      </App>
    )
  }
}
