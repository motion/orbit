import * as React from 'react'
import { App } from '@mcro/reactron'
import ShortcutsStore from '~/stores/shortcutsStore'
import { view } from '@mcro/black'
import * as RootHelpers from './rootHelpers'
import Windows from './Windows'
import { ipcMain } from 'electron'

@view.provide({
  rootStore: class RootStore {
    // used to generically talk to browser
    sendOra = null

    // sync FROM ora app to here
    oraState = {}
    _oraStateGetters = []

    error = null
    appRef = null

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
        this.sendOra = (...args) => event.sender.send(...args)
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

    handleAppRef = ref => {
      if (ref) {
        this.appRef = ref.app
      }
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
        <Windows />
      </App>
    )
  }
}
