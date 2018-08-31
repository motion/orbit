import { react, on } from '@mcro/black'
import { App } from '@mcro/stores'
import { SelectionStore } from '../../stores/SelectionStore'
import { generalSettingQuery } from '../../repositories/settingQueries'
import { modelQueryReaction } from '../../repositories/modelQueryReaction'
import { KeyboardStore } from '../../stores/KeyboardStore'

// filters = ['all', 'general', 'status', 'showoff']
// panes = [...this.mainPanes, ...this.filters]

export class PaneManagerStore {
  props: {
    selectionStore: SelectionStore
    keyboardStore: KeyboardStore
  }

  panes = ['home', 'directory', 'apps', 'settings']
  paneIndex = 0

  willMount() {
    on(this, this.props.keyboardStore, 'key', key => {
      if (!App.orbitState.inputFocused) {
        return
      }
      if (App.state.query) {
        return
      }
      if (this.props.selectionStore.activeIndex === -1) {
        if (key === 'right') {
          this.setPaneIndex(Math.min(this.panes.length - 1, this.paneIndex + 1))
        }
        if (key === 'left') {
          this.setPaneIndex(Math.max(0, this.paneIndex - 1))
        }
      }
    })

    const disposeToggleSettings = App.onMessage(
      App.messages.TOGGLE_SETTINGS,
      () => {
        this.setActivePane('settings')
        App.setOrbitState({ docked: true })
      },
    )

    const disposeShowApps = App.onMessage(App.messages.SHOW_APPS, () => {
      this.setActivePane('apps')
      App.setOrbitState({ docked: true })
    })

    // @ts-ignore
    this.subscriptions.add({
      dispose: () => {
        disposeToggleSettings()
        disposeShowApps()
      },
    })
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

  setTrayTitleOnPaneChange = react(
    () => this.activePane,
    pane => {
      if (pane === 'onboard') {
        App.actions.setContextMessage('Welcome to Orbit...')
      } else {
        App.actions.setContextMessage('')
      }
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

  beforeSetPane = () => {
    // clear selection results on change pane
    this.props.selectionStore.setResults(null)
  }

  setPaneIndex = index => {
    this.beforeSetPane()
    if (index !== this.paneIndex) {
      this.paneIndex = index
    }
  }

  indexOfPane = name => {
    return this.panes.indexOf(name)
  }

  get activePaneFast() {
    return this.panes[this.paneIndex]
  }

  forceOnboard = null

  hasOnboarded = modelQueryReaction(
    generalSettingQuery,
    setting => setting.values.hasOnboarded,
  )

  get shouldOnboard() {
    if (typeof this.forceOnboard === 'boolean') {
      return this.forceOnboard
    }
    return !this.hasOnboarded
  }

  setForceOnboard = val => {
    this.forceOnboard = val
  }

  activePane: string = react(
    () => [
      this.panes,
      this.paneIndex,
      App.orbitState.docked,
      App.state.query,
      this.shouldOnboard,
    ],
    async (_, { sleep }) => {
      if (this.shouldOnboard) {
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
}
