import { react, on, ensure, ReactionRejectionError } from '@mcro/black'
import { Direction } from './SelectionStore'
import { autoTrack } from '../helpers/Track'
import { memoize } from 'lodash'

export type Pane = { id: number; name?: string; type?: string }

export class PaneManagerStore {
  props: {
    disabled?: boolean
    panes: Pane[]
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
    if (this.props.disabled) {
      return
    }
    try {
      if (direction === Direction.right) {
        ensure('within keyable range', this.paneIndex < this.keyablePanes[1])
        this.setPaneIndex(this.paneIndex + 1)
      }
      if (direction === Direction.left) {
        ensure('within keyable range', this.paneIndex > this.keyablePanes[0])
        this.setPaneIndex(this.paneIndex - 1)
      }
    } catch (e) {
      if (e instanceof ReactionRejectionError) {
        console.debug('Not in keyable range')
        return
      }
      throw e
    }
  }

  private setPaneBy<A extends keyof Pane>(attr: A, val: Pane[A]) {
    this.setPaneIndex(this.panes.findIndex(pane => pane[attr] === val))
  }

  // set pane functions
  setActivePane = (id: number) => this.setPaneBy('id', id)
  setActivePaneByName = (name: string) => this.setPaneBy('name', name)
  setActivePaneByType = (type: string) => this.setPaneBy('type', type)
  activePaneSetter = memoize((id: number) => () => this.setActivePane(id))
  activePaneByNameSetter = memoize((name: string) => () => this.setActivePaneByName(name))
  activePaneByTypeSetter = memoize((type: string) => () => this.setActivePaneByType(type))
  activePaneIndexSetter = memoize((index: number) => () => this.setPaneIndex(index))

  hasPaneIndex = (index: number) => {
    if (index > this.panes.length - 1) {
      return false
    }
    if (index < 0) {
      return false
    }
    return true
  }

  setPaneIndex = (index: number) => {
    if (!this.hasPaneIndex(index)) {
      console.error(`no pane found! this.props.panes: ${this.panes}`)
      return
    }
    if (index !== this.paneIndex) {
      this.paneIndex = index
    }
  }

  indexOfPane = (id: number) => {
    return this.panes.findIndex(x => x.id === id)
  }

  setActivePaneToPrevious = () => {
    this.setActivePane(this.lastActivePane.id)
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
