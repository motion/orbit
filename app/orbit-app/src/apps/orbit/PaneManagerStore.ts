import { react, on, ensure } from '@mcro/black'
import { App } from '@mcro/stores'
import { SelectionStore } from '../../stores/SelectionStore'
import { generalSettingQuery } from '../../repositories/settingQueries'
import { KeyboardStore } from '../../stores/KeyboardStore'
import { Actions } from '../../actions/Actions'
import { observeOne } from '../../repositories'
import { SettingModel } from '@mcro/models'

export class PaneManagerStore {
  props: {
    selectionStore: SelectionStore
    keyboardStore: KeyboardStore
  }

  panes = ['home', 'directory', 'apps', 'settings']
  paneIndex = 0
  forceOnboard = null
  hasOnboarded = true
  generalSetting = null

  didMount() {
    on(
      this,
      observeOne(SettingModel, { args: generalSettingQuery }).subscribe(
        generalSetting => {
          this.generalSetting = generalSetting
        },
      ),
    )

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
    () => this.activePane === 'onboard',
    onboard => {
      if (onboard) {
        Actions.setContextMessage('Welcome to Orbit...')
      } else {
        Actions.setContextMessage('')
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
      ensure('pane', !!pane)
      ensure('target', !!App.peekState.target)
      Actions.clearPeek()
    },
  )
}
