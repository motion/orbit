import { react, on } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'
import { SearchStore } from 'stores/SearchStore'

// filters = ['all', 'general', 'status', 'showoff']
// panes = [...this.mainPanes, ...this.filters]

export class PaneManagerStore {
  props: {
    searchStore: SearchStore
  }

  panes = ['home', 'directory', 'settings']
  paneIndex = 0

  willMount() {
    on(this, this.props.searchStore, 'key', key => {
      // no keyshortcuts when peek is open
      if (!App.orbitState.inputFocused) {
        console.log('not input focused')
        return
      }
      if (App.state.query) {
        return
      }
      if (key === 'right') {
        this.setPaneIndex(Math.min(this.panes.length - 1, this.paneIndex + 1))
      }
      if (key === 'left') {
        this.setPaneIndex(Math.max(0, this.paneIndex - 1))
      }
    })

    const dispose = App.onMessage(App.messages.TOGGLE_SETTINGS, () => {
      console.log('got message toggle settings')
      this.setActivePane('settings')
      App.setOrbitState({ docked: true })
    })
    this.subscriptions.add({ dispose })
  }

  setActivePaneHomeOnSearchInSettings = react(
    () => App.state.query,
    () => {
      if (this.activePane !== 'settings') {
        throw react.cancel
      }
      this.setActivePane('home')
    },
  )

  setDirectoryOnAt = react(
    () => App.state.query[0] === '@',
    isDir => {
      if (isDir) {
        this.setActivePane('directory')
      } else if (this.activePane === 'directory') {
        this.setActivePane(this.lastActivePane)
      }
    },
  )

  setActivePane = name => {
    this.setPaneIndex(this.panes.findIndex(val => val === name))
  }

  setPaneIndex = index => {
    if (index !== this.paneIndex) {
      this.paneIndex = index
    }
  }

  get activePaneFast() {
    return this.panes[this.paneIndex]
  }

  activePane = react(
    () => [
      this.panes,
      this.paneIndex,
      App.orbitState.docked,
      App.state.query,
      Desktop.state.shouldOnboard,
    ],
    async (_, { sleep }) => {
      if (Desktop.state.shouldOnboard) {
        return 'onboard'
      }
      // let activePaneFast be a frame ahead
      await sleep(32)
      let active = this.panes[this.paneIndex]
      if (active === 'home' && App.state.query) {
        active = 'search'
      }
      if (active === this.activePane) {
        throw react.cancel
      }
      return active
    },
    {
      immediate: true,
    },
  )

  lastActivePane = react(() => this.activePane, _ => _, { delayValue: true })

  clearPeekOnActivePaneChange = react(
    () => this.activePane,
    pane => {
      if (!pane) {
        throw react.cancel
      }
      if (!App.peekState.target) {
        throw react.cancel
      }
      App.actions.clearPeek()
    },
  )

  animationState = react(
    () => App.orbitState.docked,
    async (visible, { sleep, setValue }) => {
      // hmr already showing
      if (visible && this.animationState.visible) {
        throw react.cancel
      }
      // old value first to setup for transition
      setValue({ willAnimate: true, visible: !visible })
      await sleep(32)
      // new value, start transition
      setValue({ willAnimate: true, visible })
      await sleep(App.animationDuration * 2)
      // done animating, reset
      setValue({ willAnimate: false, visible })
      // this would do the toggle after the animation, trying out doing it before to see if its faster
      // App.sendMessage(
      //   Electron,
      //   visible ? Electron.messages.FOCUS : Electron.messages.DEFOCUS,
      // )
    },
    {
      immediate: true,
      log: false,
      defaultValue: { willAnimate: false, visible: App.orbitState.docked },
    },
  )
}
