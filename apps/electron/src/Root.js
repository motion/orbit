import * as React from 'react'
import { App } from '@mcro/reactron'
import ShortcutsStore from '~/stores/shortcutsStore'
import { view } from '@mcro/black'
import Windows from './Windows'
import Tray from './Tray'
import * as Helpers from '~/helpers'
import Screen from '@mcro/screen'

@view.provide({
  rootStore: class RootStore {
    error = null
    appRef = null
    oraRef = null
    settingsVisible = false

    willMount() {
      global.rootStore = this
      Screen.start('electron')
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
      let optionDelay
      let justCleared = false
      this.react(() => Screen.appState, x => console.log('appState', x))
      this.react(() => Screen.desktopState.keyboard, function watchKeyboard(
        keyboard,
      ) {
        if (!keyboard) {
          return
        }
        console.log('got keyboard', keyboard, lastKeyboard)
        const { option, optionCleared } = keyboard
        if (Screen.appState.hidden) {
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
      })
    }

    toggleShown = async () => {
      if (Screen.appState.pinned) {
        return
      }
      if (!this.appRef) {
        console.log('no app ref :(')
        return
      }
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
      Screen.setState({ shouldHide: false })
      await Helpers.sleep(150) // animate
      this.appRef.focus()
      this.oraRef.focus()
    }

    async hideOra() {
      console.log('hideOra')
      Screen.setState({ shouldHide: true })
      await Helpers.sleep(150) // animate
      if (!this.settingsVisible && !Screen.appState.preventElectronHide) {
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
        <Tray onClick={Screen.swiftBridge.toggle} />
      </App>
    )
  }
}
