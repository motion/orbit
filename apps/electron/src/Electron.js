import * as React from 'react'
import { App as AppWindow } from '@mcro/reactron'
import ShortcutsStore from '~/stores/shortcutsStore'
import { view, debugState } from '@mcro/black'
import Tray from './views/Tray'
import MenuItems from './views/MenuItems'
import HighlightsWindow from './views/HighlightsWindow'
import PeekWindow from './views/PeekWindow'
import OrbitWindow from './views/OrbitWindow'
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

      let optnEnter

      this.react(
        () => [Desktop.state.keyboard.option, Desktop.state.keyboard.optionUp],
        debounce(([option, optionUp]) => {
          clearTimeout(optnEnter)
          const lastActionWasToggle = this.lastToggle > option
          if (lastActionWasToggle) {
            log(`just toggled, avoid option handle`)
            return
          }
          const isHolding = option > optionUp
          if (!isHolding) {
            if (1 === 1 || App.peek.focused) {
              log('PREVENT HIDE WHEN PEEK IS HOVERED')
            }
            this.shouldHide()
            return
          }
          if (App.state.orbitHidden) {
            // SHOW
            optnEnter = setTimeout(this.shouldShow, 150)
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

    toggleShown = async () => {
      if (App.state.pinned) return
      if (!this.appRef) return
      if (!App.state.orbitHidden) {
        this.shouldHide()
      } else {
        this.shouldShow()
        this.appRef.focus()
      }
    }

    async shouldShow() {
      log('shouldShow')
      this.appRef.show()
      Electron.setState({ shouldShow: Date.now() })
    }

    async shouldHide() {
      log('shouldHide')
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
        {/* <HighlightsWindow /> */}
        <PeekWindow />
        <OrbitWindow />
        {/* <SettingsWindow /> */}
        <Tray />
      </AppWindow>
    )
  }
}
