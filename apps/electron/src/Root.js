import * as React from 'react'
import { App } from '@mcro/reactron'
import ShortcutsStore from '~/stores/shortcutsStore'
import { view } from '@mcro/black'
import Windows from './Windows'
import Tray from './Tray'
import { ipcMain } from 'electron'
import * as Helpers from '~/helpers'
import { debounce } from 'lodash'
import screenStore from '@mcro/screen-store'

@view.provide({
  rootStore: class RootStore {
    screen = screenStore
    // used to generically talk to browser
    sendOra = null

    error = null
    appRef = null
    oraRef = null
    settingsVisible = false

    willMount() {
      global.rootStore = this
      this.screen.start('electron')
      new ShortcutsStore().emitter.on('shortcut', shortcut => {
        console.log('emit shortcut', shortcut)
        this.emit('shortcut', shortcut)
      })
      this.setupOraLink()
      this.on('shortcut', shortcut => {
        if (shortcut === 'Option+Space') {
          if (this.screen.keyboard.option) {
            console.log('avoid toggle while holding option')
            return
          }
          this.toggleShown()
        }
      })
      // watch option hold
      let lastKeyboard = {}
      let optionDelay
      let justCleared = false
      this.react(
        () => this.screen.keyboard,
        keyboard => {
          if (!keyboard) {
            return
          }
          console.log('got keyboard', keyboard, lastKeyboard)
          const { option, optionCleared } = keyboard
          if (this.screen.appState.hidden) {
            // HIDDEN
            // clear last if not opened yet
            if (optionCleared) {
              clearTimeout(optionDelay)
            }
            // delay before opening on option
            if (!lastKeyboard.option && option) {
              optionDelay = setTimeout(this.toggleShown, 50)
            }
          } else {
            // SHOWN
            if (optionCleared) {
              justCleared = true
              // dont toggle
              return
            }
            if (justCleared) {
              justCleared = false
              // an option event comes again after cleared saying its false
              return
            }
            if (lastKeyboard.option && !option) {
              this.toggleShown()
            }
          }
          lastKeyboard = keyboard
        },
      )
    }

    setupOraLink() {
      this.on(ipcMain, 'start-ora', event => {
        this.sendOra = (...args) => {
          try {
            event.sender.send(...args)
          } catch (err) {
            console.log('error sending ora message', err.message)
          }
        }
      })
    }

    toggleShown = debounce(async () => {
      if (this.screen.appState.pinned) {
        return
      }
      if (!this.appRef) {
        console.log('no app ref :(')
        return
      }
      if (!this.screen.appState.hidden) {
        this.hideOra()
      } else {
        this.showOra()
      }
    }, 80)

    async showOra() {
      console.log('showOra')
      this.appRef.show()
      await Helpers.sleep(50)
      await this.sendOra('ora-toggle')
      await Helpers.sleep(150)
      this.appRef.focus()
      this.oraRef.focus()
    }

    async hideOra() {
      console.log('hideOra')
      await this.sendOra('ora-toggle')
      await Helpers.sleep(150)
      if (!this.settingsVisible && !this.screen.appState.preventElectronHide) {
        this.appRef.hide()
      }
    }

    handleAppRef = ref => {
      if (ref) {
        this.appRef = ref.app
      }
    }

    handleSettingsVisibility = isVisible => {
      this.settingsVisible = isVisible
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
    this.props.rootStore.error = error
  }

  render({ rootStore }) {
    if (rootStore.error) {
      return null
    }
    return (
      <App
        onBeforeQuit={rootStore.handleBeforeQuit}
        onQuit={rootStore.handleQuit}
        ref={rootStore.handleAppRef}
      >
        <Windows
          onOraRef={rootStore.handleOraRef}
          onSettingsVisibility={rootStore.handleSettingsVisibility}
        />
        <Tray onClick={rootStore.screen.swiftBridge.toggle} />
      </App>
    )
  }
}
