import * as React from 'react'
import { App } from '@mcro/reactron'
import ShortcutsStore from '~/stores/shortcutsStore'
import { view } from '@mcro/black'
import * as RootHelpers from './rootHelpers'
import Windows from './Windows'
import Tray from './Tray'
import { ipcMain } from 'electron'
import * as Helpers from '~/helpers'
import { throttle } from 'lodash'

@view.provide({
  rootStore: class RootStore {
    // used to generically talk to browser
    sendOra = null

    // sync FROM ora app to here
    oraState = {}
    _oraStateGetters = []

    error = null
    appRef = null
    oraRef = null
    settingsVisible = false

    willMount() {
      new ShortcutsStore().emitter.on('shortcut', shortcut => {
        console.log('emit shortcut', shortcut)
        this.emit('shortcut', shortcut)
      })
      RootHelpers.listenForAuth.call(this)
      RootHelpers.listenForOpenBrowser.call(this)
      RootHelpers.listenForCrawlerInject.call(this)
      RootHelpers.injectRepl({ rootStore: this })
      this.setupOraLink()

      this.on('shortcut', shortcut => {
        if (shortcut === 'Option+Space') {
          this.toggleShown()
        }
      })
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
        this.oraState = state
        if (this._oraStateGetters.length) {
          for (const getter of this._oraStateGetters) {
            getter(state)
          }
          this._oraStateGetters = []
        } else {
          console.log('nothing is listening for state')
        }
      })
    }

    toggleShown = throttle(async () => {
      if (!this.appRef) {
        console.log('no app ref :(')
        return
      }
      if (!this.oraState.hidden) {
        console.log('send toggle')
        await this.sendOraSync('ora-toggle')
        await Helpers.sleep(150)
        console.log('now hide')
        if (!this.settingsVisible && !this.oraState.preventElectronHide) {
          this.appRef.hide()
        }
      } else {
        this.appRef.show()
        await Helpers.sleep(50)
        await this.sendOraSync('ora-toggle')
        await Helpers.sleep(150)
        this.appRef.focus()
        this.oraRef.focus()
      }
    }, 200)

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
      <App onBeforeQuit={rootStore.onBeforeQuit} ref={rootStore.handleAppRef}>
        <Windows
          onOraRef={rootStore.handleOraRef}
          onSettingsVisibility={rootStore.handleSettingsVisibility}
        />
        <Tray onClick={rootStore.toggleShown} />
      </App>
    )
  }
}
