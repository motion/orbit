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

  subPane = ''
  keyablePanes = [0, 4]
  paneIndex = 0
  forcePane = null
  hasOnboarded = true
  lastActivePane = react(() => this.activePane, _ => _, {
    delayValue: true,
    onlyUpdateIfChanged: true,
  })
  generalSetting = null
  generalSetting$ = observeOne(SettingModel, generalSettingQuery).subscribe(({ values }) => {
    this.hasOnboarded = values.hasOnboarded
  })

  didMount() {
    on(this, autoTrack(this, ['hasOnboarded', 'paneIndex']))

    on(
      this,
      observeOne(SettingModel, generalSettingQuery).subscribe(generalSetting => {
        this.generalSetting = generalSetting
      }),
    )
  }

  willUnmount() {
    this.generalSetting$.unsubscribe()
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

  setForcePane = val => {
    this.forcePane = val
  }

  activePane = react(
    () => [this.forcePane, this.panes, this.paneIndex],
    async ([forcePane], { sleep }) => {
      if (forcePane) {
        return forcePane
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

  subPaneSetter = memoize(val => () => this.setSubPane(val))

  setSubPane = val => {
    this.subPane = val
  }
}
