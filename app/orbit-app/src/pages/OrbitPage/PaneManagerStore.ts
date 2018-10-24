import { react, on, ensure, ReactionRejectionError } from '@mcro/black'
import { App } from '@mcro/stores'
import { SelectionStore, Direction } from './orbitDocked/SelectionStore'
import { Actions } from '../../actions/Actions'
import { observeOne } from '@mcro/model-bridge'
import { SettingModel, GeneralSettingValues } from '@mcro/models'
import { OrbitStore } from './OrbitStore'
import { autoTrack } from '../../stores/Track'
import { memoize } from 'lodash'
import { AppsStore } from '../../stores/AppsStore'

type Panes = 'home' | 'settings' | 'onboard' | string

export class PaneManagerStore {
  props: {
    appsStore: AppsStore
    orbitStore: OrbitStore
    selectionStore: SelectionStore
  }

  panes: Partial<Panes>[] = [
    'home',
    'search',
    'people',
    'topics',
    'list',
    'help',
    'new',
    'settings',
  ]
  keyablePanes = [0, 6]
  paneIndex = 0
  forceOnboard = null
  hasOnboarded = true
  subPane = 'apps'

  lastActivePane = react(() => this.activePane, {
    delayValue: true,
  })

  // setPanes = react(
  //   () => this.props.appsStore.activeIntegrations,
  //   apps => {
  //     this.panes = ['home', ...apps.map(x => x.display.name), 'settings']
  //   },
  // )

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
    on(this, autoTrack(this, ['hasOnboarded', 'paneIndex']))

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

  move = (direction: Direction) => {
    try {
      if (this.props.selectionStore.activeIndex === -1) {
        if (direction === Direction.right) {
          ensure('within keyable range', this.paneIndex < this.keyablePanes[1])
          this.setPaneIndex(this.paneIndex + 1)
        }
        if (direction === Direction.left) {
          ensure('within keyable range', this.paneIndex > this.keyablePanes[0])
          this.setPaneIndex(this.paneIndex - 1)
        }
      }
    } catch (e) {
      if (e !== ReactionRejectionError) {
        throw e
      }
    }
  }

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

  activePaneSetter = memoize(index => () => this.setPaneIndex(index))

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

  setActivePaneSearch = () => {
    this.setActivePane('search')
  }

  setActivePaneToPrevious = () => {
    this.setActivePane(this.lastActivePane)
  }

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
