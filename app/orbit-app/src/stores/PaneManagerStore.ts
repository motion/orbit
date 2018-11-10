import { react, on, ensure, ReactionRejectionError } from '@mcro/black'
import { App } from '@mcro/stores'
import { SelectionStore, Direction } from './SelectionStore'
import { observeOne } from '@mcro/model-bridge'
import { SettingModel } from '@mcro/models'
import { autoTrack } from '../helpers/Track'
import { memoize } from 'lodash'
import { AppActions } from '../actions/AppActions'
import { generalSettingQuery } from '../helpers/queries'

export class PaneManagerStore {
  props: {
    selectionStore?: SelectionStore
    panes: string[]
  }

  get panes() {
    return this.props.panes
  }

  keyablePanes = [0, 4]
  paneIndex = 0
  forceOnboard = null
  hasOnboarded = true
  subPane = 'team'
  lastActivePane = react(() => this.activePane, _ => _, {
    delayValue: true,
    onlyUpdateIfChanged: true,
  })
  generalSetting = null
  generalSetting$ = observeOne(SettingModel, generalSettingQuery).subscribe(({ values }) => {
    this.hasOnboarded = values.hasOnboarded
  })

  disposeToggleSettings: any
  disposeShowApps: any

  didMount() {
    on(this, autoTrack(this, ['hasOnboarded', 'paneIndex']))

    on(
      this,
      observeOne(SettingModel, generalSettingQuery).subscribe(generalSetting => {
        this.generalSetting = generalSetting
      }),
    )

    this.disposeToggleSettings = App.onMessage(App.messages.TOGGLE_SETTINGS, () => {
      this.setActivePane('settings')
      App.setOrbitState({ docked: true })
    })

    this.disposeShowApps = App.onMessage(App.messages.SHOW_APPS, () => {
      this.setActivePane('apps')
      App.setOrbitState({ docked: true })
    })
  }

  willUnmount() {
    this.generalSetting$.unsubscribe()
    this.disposeToggleSettings()
    this.disposeShowApps()
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
      if (e instanceof ReactionRejectionError) {
        return
      }
      throw e
    }
  }

  setTrayTitleOnPaneChange = react(
    () => this.activePane === 'onboard',
    onboard => {
      if (onboard) {
        AppActions.setContextMessage('Welcome to Orbit...')
      } else {
        AppActions.setContextMessage('Orbit')
      }
    },
  )

  setActivePane = name => {
    const nextIndex = this.panes.findIndex(val => val === name)
    this.setPaneIndex(nextIndex)
  }

  activePaneSetter = memoize(index => () => this.setPaneIndex(index))

  setPaneIndex = index => {
    if (index > this.panes.length - 1) {
      return
    }
    if (index < 0) {
      return
    }
    if (index !== this.paneIndex) {
      if (this.props.selectionStore) {
        // clear selection results on change pane
        this.props.selectionStore.setResults(null)
      }
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

  activePane = react(
    () => [this.panes, this.paneIndex, this.shouldOnboard],
    async (_, { sleep }) => {
      if (this.shouldOnboard) {
        return 'onboard'
      }
      const active = this.panes[this.paneIndex]
      ensure('changed', active !== this.activePane)
      // let activePaneFast be a frame ahead
      await sleep()
      return active
    },
  )

  setActivePaneToPrevious = () => {
    this.setActivePane(this.lastActivePane)
  }

  clearPeekOnActivePaneChange = react(
    () => this.activePane,
    pane => {
      ensure('pane', !!pane)
      ensure('target', !!App.peekState.target)
      AppActions.clearPeek()
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
