import { react, on, ensure, ReactionRejectionError } from '@mcro/black'
import { SelectionStore, Direction } from './SelectionStore'
import { autoTrack } from '../helpers/Track'
import { memoize } from 'lodash'

export class PaneManagerStore {
  props: {
    selectionStore?: SelectionStore
    panes: string[]
    onPaneChange: Function
  }

  get panes() {
    return this.props.panes
  }

  keyablePanes = [0, 3]
  paneIndex = 0

  activePane = react(
    () => this.panes[this.paneIndex],
    async (val, { sleep }) => {
      // keyboard nav people may hold it down to move fast, this makes it more smooth
      await sleep(50)
      return val
    },
  )

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

  activePaneSetter = memoize((name: string) => () => this.setActivePane(name))

  activePaneIndexSetter = memoize((index: number) => () => this.setPaneIndex(index))

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

  handleOnPaneChange = react(
    () => this.activePane,
    pane => {
      if (this.props.onPaneChange) {
        this.props.onPaneChange(pane)
      }
    },
    {
      deferFirstRun: true,
    },
  )
}
