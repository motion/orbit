import * as React from 'react'
import { App } from '@mcro/reactron'
import ShortcutsStore from '~/stores/shortcutsStore'
import { view } from '@mcro/black'
import Windows from './Windows'
import Tray from './Tray'
import { ipcMain } from 'electron'
import * as Helpers from '~/helpers'
import { throttle } from 'lodash'
import ScreenStore from '@mcro/screen-store'

@view.provide({
  rootStore: class RootStore {
    screen = new ScreenStore()
    // used to generically talk to browser
    sendOra = null

    // sync FROM ora app to here
    // see web/src/stores/uiStore
    oraState = {}
    _oraStateGetters = []

    error = null
    appRef = null
    oraRef = null
    settingsVisible = false

    willMount() {
      global.rootStore = this
      this.screen.start()
      new ShortcutsStore().emitter.on('shortcut', shortcut => {
        console.log('emit shortcut', shortcut)
        this.emit('shortcut', shortcut)
      })
      this.setupOraLink()
      this.on('shortcut', shortcut => {
        if (shortcut === 'Option+Space') {
          this.toggleShown()
        }
      })
      // watch option hold
      this.react(
        () => this.screen.keyboard.option,
        val => {
          console.log('seeing screen keyboard option', val)
          this.toggleShown()
        },
      )
    }

    sendOraSync = async (...args) => {
      if (this.sendOra) {
        this.sendOra(...args)
        return await this.getOraState()
      }
    }

    getOraState = () =>
      new Promise(res => {
        this._oraStateGetters.push(res)
        this.sendOra('get-state')
      })

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

      // if you call this.getOraState() this will handle it
      this.on(ipcMain, 'set-state', (event, state) => {
        // update state
        this.updateOraState(state)
        if (this._oraStateGetters.length) {
          for (const getter of this._oraStateGetters) {
            getter(state)
          }
          this._oraStateGetters = []
        }
      })
    }

    updateOraState = state => {
      this.oraState = { ...state }
    }

    toggleShown = throttle(async () => {
      if (!this.appRef) {
        console.log('no app ref :(')
        return
      }
      if (!this.oraState.hidden) {
        this.hideOra()
      } else {
        this.showOra()
      }
    }, 80)

    async showOra() {
      console.log('showOra')
      this.appRef.show()
      await Helpers.sleep(50)
      await this.sendOraSync('ora-toggle')
      await Helpers.sleep(150)
      this.appRef.focus()
      this.oraRef.focus()
    }

    async hideOra() {
      console.log('hideOra')
      await this.sendOraSync('ora-toggle')
      await Helpers.sleep(150)
      if (!this.settingsVisible && !this.oraState.preventElectronHide) {
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
