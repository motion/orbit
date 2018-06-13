import { react } from '@mcro/black'
import { App, Electron } from '@mcro/all'
import * as PeekStateActions from '~/actions/PeekStateActions'

// filters = ['all', 'general', 'status', 'showoff']
// panes = [...this.mainPanes, ...this.filters]

export class OrbitDockedPaneStore {
  panes = ['home', 'directory', 'settings']
  paneIndex = 0

  willMount() {
    this.on(this.props.orbitStore, 'key', key => {
      if (key === 'right') {
        this.paneIndex = Math.min(this.panes.length - 1, this.paneIndex + 1)
      }
      if (key === 'left') {
        this.paneIndex = Math.max(0, this.paneIndex - 1)
      }
    })

    App.onMessage(App.messages.TOGGLE_SETTINGS, () => {
      console.log('got message toggle settings')
      this.setActivePane('settings')
      App.setOrbitState({ docked: true })
    })
  }

  setActivePane = name => {
    this.paneIndex = this.panes.findIndex(val => val === name)
  }

  get activePane() {
    if (!App.orbitState.docked) {
      return this.panes[this.paneIndex]
    }
    if (App.state.query) {
      return 'search'
    }
    return this.panes[this.paneIndex]
  }

  clearPeekOnActivePaneChange = react(
    () => this.activePane,
    PeekStateActions.clearPeek,
    {
      log: 'state',
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
      App.sendMessage(
        Electron,
        visible ? Electron.messages.FOCUS : Electron.messages.DEFOCUS,
      )
    },
    {
      immediate: true,
      log: false,
      defaultValue: { willAnimate: false, visible: App.orbitState.docked },
    },
  )
}
