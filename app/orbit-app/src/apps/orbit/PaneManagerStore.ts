import { react, on, ensure } from '@mcro/black'
import { App } from '@mcro/stores'
import { SelectionStore } from './orbitDocked/SelectionStore'
import { KeyboardStore } from '../../stores/KeyboardStore'
import { Actions } from '../../actions/Actions'
import { observeOne } from '@mcro/model-bridge'
import { SettingModel, GeneralSettingValues } from '@mcro/models'
import { OrbitStore } from '../OrbitStore'
import { autoTrack } from '../../stores/Track'
import { memoize } from 'lodash'

type Panes = 'home' | 'search' | 'settings' | 'onboard'

export class PaneManagerStore {
  props: {
    orbitStore: OrbitStore
    selectionStore: SelectionStore
    keyboardStore: KeyboardStore
  }

  panes: Partial<Panes>[] = ['home', 'search', 'settings']
  paneIndex = 0
  forceOnboard = null
  hasOnboarded = true
  lastKey = { key: null, at: Date.now() }
  subPane = 'apps'

  generalSetting = null
  generalSetting$ = observeOne(SettingModel, {
    args: {
      where: {
        type: 'general',
        category: 'general',
      },
    },
  }).subscribe(generalSetting => {
    const values = generalSetting.values as GeneralSettingValues
    this.hasOnboarded = values.hasOnboarded
  })

  didMount() {
    on(this, autoTrack(this, ['hasOnboarded', 'lastKey', 'paneIndex']))

    // set pane manager store... todo make better
    this.props.orbitStore.appReactionsStore.setPaneManagerStore(this)

    on(
      this,
      observeOne(SettingModel, {
        args: { where: { type: 'general', category: 'general' } },
      }).subscribe(generalSetting => {
        this.generalSetting = generalSetting
      }),
    )

    on(this, this.props.keyboardStore, 'key', key => {
      this.lastKey = { key, at: Date.now() }
    })

    const disposeToggleSettings = App.onMessage(App.messages.TOGGLE_SETTINGS, () => {
      this.setActivePane('settings')
      App.setOrbitState({ docked: true })
    })

    const disposeShowApps = App.onMessage(App.messages.SHOW_APPS, () => {
      this.setActivePane('apps')
      App.setOrbitState({ docked: true })
    })

    // @ts-ignore
    this.subscriptions.add({
      dispose: () => {
        this.generalSetting$.unsubscribe()
        disposeToggleSettings()
        disposeShowApps()
      },
    })
  }

  onKey = react(
    () => this.lastKey,
    ({ key }) => {
      ensure('key', !!key)
      ensure('focused', this.props.orbitStore.inputFocused)
      if (this.props.selectionStore.activeIndex === -1) {
        if (key === 'right') {
          ensure('within keyable range', this.paneIndex < 1)
          this.setPaneIndex(this.paneIndex + 1)
        }
        if (key === 'left') {
          ensure('within keyable range', this.paneIndex > 0)
          this.setPaneIndex(this.paneIndex - 1)
        }
      }
    },
  )

  setTrayTitleOnPaneChange = react(
    () => this.activePane === 'onboard',
    onboard => {
      if (onboard) {
        Actions.setContextMessage('Welcome to Orbit...')
      } else {
        Actions.setContextMessage('Orbit')
      }
    },
  )

  setActivePane = name => {
    this.setPaneIndex(this.panes.findIndex(val => val === name))
  }

  activePaneSetter = memoize(name => () => this.setActivePane(name))

  beforeSetPane = () => {
    // clear selection results on change pane
    this.props.selectionStore.setResults(null)
  }

  setPaneIndex = index => {
    if (index > this.panes.length - 1) {
      return
    }
    if (index < 0) {
      return
    }
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

  activePane: Panes = react(
    () => [this.panes, this.paneIndex, this.shouldOnboard],
    async (_, { sleep }) => {
      if (this.shouldOnboard) {
        return 'onboard'
      }
      const active = this.panes[this.paneIndex]
      ensure('changed', active !== this.activePane)
      // let activePaneFast be a frame ahead
      await sleep(32)
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

  subPaneSetter = memoize(val => () => {
    this.subPane = val
  })

  goToTeamSettings = () => {
    this.setActivePane('settings')
    this.subPane = 'team'
  }
}
