import { react, on, ensure, ReactionRejectionError } from '@mcro/black'
import { App } from '@mcro/stores'
import { SelectionStore, Direction } from './SelectionStore'
import { autoTrack } from '../helpers/Track'
import { memoize } from 'lodash'
import { AppActions } from '../actions/AppActions'

export class PaneManagerStore {
  props: {
    selectionStore?: SelectionStore
    panes: string[]
  }

  get panes() {
    return this.props.panes
  }

  keyablePanes = [0, 3]
  paneIndex = 0

  activePane = react(() => this.panes[this.paneIndex], _ => _)

  lastActivePane = react(() => this.activePane, _ => _, {
    delayValue: true,
    onlyUpdateIfChanged: true,
  })

  didMount() {
    on(this, autoTrack(this, ['paneIndex']))
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

  hasPaneIndex = index => {
    if (index > this.panes.length - 1) {
      return false
    }
    if (index < 0) {
      return false
    }
    return true
  }

  setPaneIndex = index => {
    if (!this.hasPaneIndex(index)) {
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
}
