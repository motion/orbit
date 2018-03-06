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
import { debounce } from 'lodash'

const log = debug('Electron')

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

      this.watchOptionPress()
    }

    watchOptionPress = () => {
      // watch option hold
      this.lastToggle = Date.now()

      new ShortcutsStore().emitter.on('shortcut', shortcut => {
        console.log('emit shortcut', shortcut)
        if (shortcut === 'Option+Space') {
          // if (Screen.desktopState.keyboard.option) {
          //   console.log('avoid toggle while holding option')
          //   return
          // }
          this.lastToggle = Date.now()
          console.log('got a toggle')
          this.toggleShown()
        }
      })

      this.react(
        () => [
          Screen.desktopState.keyboard.option,
          Screen.desktopState.keyboard.optionUp,
        ],
        this.handleOptionKey,
      )
    }

    // debounced so it comes after toggles
    handleOptionKey = debounce(([option, optionUp]) => {
      clearTimeout(this.optnLeave)
      clearTimeout(this.optnEnter)
      const isHolding = option > optionUp
      if (!isHolding) {
        if (Screen.electronState.peekFocused) {
          log('mouse is over peek, dont hide')
        }
        this.hideOra()
        return
      }
      if (Screen.appState.peekHidden) {
        // SHOW
        if (optionUp) {
          clearTimeout(this.optnEnter)
        }
        if (isHolding) {
          this.optnEnter = setTimeout(this.showOra, 150)
        }
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
