import * as React from 'react'
import { App } from '@mcro/reactron'
import ShortcutsStore from '~/stores/shortcutsStore'
import { view } from '@mcro/black'
import Tray from './views/Tray'
import MenuItems from './views/MenuItems'
import HighlightsWindow from './views/HighlightsWindow'
import OraWindow from './views/OraWindow'
import PeekWindow from './views/PeekWindow'
import SettingsWindow from './views/SettingsWindow'
import * as Helpers from '~/helpers'
import Screen from '@mcro/screen'
import global from 'global'
import { screen } from 'electron'
import * as Constants from '~/constants'

@view.provide({
  electron: class ElectronStore {
    error = null
    appRef = null
    oraRef = null

    willMount() {
      global.App = this
      // initial state
      const { position, size } = Helpers.getAppSize()
      const screenSize = screen.getPrimaryDisplay().workAreaSize
      const oraPosition = [screenSize.width - Constants.ORA_WIDTH, 20]
      // setup screen
      Screen.start('electron', {
        shouldHide: null,
        shouldShow: null,
        shouldPause: null,
        peekState: {},
        focused: false,
        showSettings: false,
        showDevTools: {
          app: false,
          peek: false,
          highlights: false,
          settings: true,
        },
        lastMove: Date.now(),
        show: true,
        settingsPosition: position,
        size,
        screenSize,
        oraPosition,
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

      // watch option hold
      let lastKeyboard = {}
      let justCleared = false
      let optnEnter
      let optnLeave
      this.react(() => Screen.desktopState.keyboard, function watchKeyboard(
        keyboard,
      ) {
        if (!keyboard) return
        clearTimeout(optnLeave)
        const { option, optionCleared } = keyboard
        if (Screen.appState.hidden) {
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
          // an option event comes again after cleared saying its false
          if (justCleared) {
            justCleared = false
            return
          }
          if (lastKeyboard.option && !option) {
            optnLeave = setTimeout(this.hideOra, 40)
          }
        }
        lastKeyboard = keyboard
      })
    }

    reload() {
      if (process.env.NODE_ENV === 'development') {
        require('touch')(require('path').join(__dirname, '..', 'package.json'))
      }
    }

    toggleShown = async () => {
      if (Screen.appState.pinned) return
      if (!this.appRef) return
      if (!Screen.appState.hidden) {
        this.hideOra()
      } else {
        this.showOra()
      }
    }

    async showOra() {
      console.log('showOra')
      this.appRef.show()
      await Helpers.sleep(50)
      Screen.setState({ shouldShow: Date.now() })
      await Helpers.sleep(250) // animate
      this.appRef.focus()
      this.oraRef.focus()
    }

    async hideOra() {
      console.log('hideOra')
      Screen.setState({ shouldHide: Date.now() })
      await Helpers.sleep(150) // animate
      if (
        !Screen.state.settingsVisible &&
        !Screen.appState.preventElectronHide
      ) {
        this.appRef.hide()
      }
    }

    handleAppRef = ref => {
      if (ref) {
        this.appRef = ref.app
      }
    }

    handleOraRef = ref => {
      this.oraRef = ref
    }

    handleBeforeQuit = () => {
      console.log('before quit')
    }

    handleQuit = () => {
      console.log('handling quit')
      process.exit(0)
    }
  },
})
@view.electron
export default class Root extends React.Component {
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
        <OraWindow onRef={electron.handleOraRef} />
        <PeekWindow appPosition={Screen.state.oraPosition.slice(0)} />
        {/* <SettingsWindow /> */}
        <Tray />
      </App>
    )
  }
}
