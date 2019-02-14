import { ensure, on, react, ReactionRejectionError } from '@mcro/black'
import { memoize } from 'lodash'
import { autoTrack } from '../helpers/Track'
import { Direction } from './SelectionStore'

export type Pane = {
  id: string
  type: string
  name?: string
  keyable?: boolean
  isHidden?: boolean
  // lets you use this a bit more dynamically
  subType?: string
}

export class PaneManagerStore {
  props: {
    disabled?: boolean
    defaultPanes: Pane[]
    onPaneChange: (index: number, pane: Pane) => any
    defaultPaneIndex?: number
  }

  paneIndex = this.props.defaultPaneIndex || 0
  panes = [...this.props.defaultPanes]

  syncPaneIndexProp = react(
    () => this.props.defaultPaneIndex,
    index => {
      this.paneIndex = index
    },
    {
      deferFirstRun: true,
    },
  )

  setPanes(panes: Pane[]) {
    console.log('panes', panes)
    this.panes = panes
  }

  get activePane(): Pane {
    return this.panes[this.paneIndex] || this.lastActivePane
  }

  lastActivePane = react(() => this.activePane, _ => _, {
    delayValue: true,
  })

  didMount() {
    on(this, autoTrack(this, ['paneIndex']))
  }

  back = () => {
    if (this.lastActivePane) {
      this.setActivePane(this.lastActivePane.id)
    }
  }

  move = (direction: Direction) => {
    if (this.props.disabled) {
      return
    }
    try {
      if (direction === Direction.right) {
        ensure('keyable', this.panes[this.paneIndex + 1] && this.panes[this.paneIndex + 1].keyable)
        this.setPaneIndex(this.paneIndex + 1)
      }
      if (direction === Direction.left) {
        ensure('keyable', this.panes[this.paneIndex - 1] && this.panes[this.paneIndex - 1].keyable)
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
    const index = this.panes.findIndex(pane => pane[attr] === val)
    if (index === -1) {
      debugger
    }
    this.setPaneIndex(index)
  }

  // set pane functions
  setActivePane = (id: string) => this.setPaneBy('id', id)
  setActivePaneByName = (name: string) => this.setPaneBy('name', name)
  setActivePaneByType = (type: string) => this.setPaneBy('type', type)
  activePaneSetter = memoize((id: string) => () => this.setActivePane(id))
  activePaneByNameSetter = memoize((name: string) => () => this.setActivePaneByName(name))
  activePaneByTypeSetter = memoize((type: string) => () => this.setActivePaneByType(type))

  setPaneByKeyableIndex(index: number) {
    this.setActivePane(this.panes.filter(x => x.keyable && !x.isHidden)[index].id)
  }

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
      console.trace(`no 09 pane found at index ${index}! this.props.panes`, this.panes)
      return
    }
    if (index !== this.paneIndex) {
      this.paneIndex = index
    }
  }

  indexOfPane = (id: string) => {
    return this.panes.findIndex(x => x.id === id)
  }

  setActivePaneToPrevious = () => {
    if (this.lastActivePane) {
      this.setActivePane(this.lastActivePane.id)
    }
  }

  handleOnPaneChange = react(
    () => this.activePane,
    pane => {
      if (this.props.onPaneChange) {
        this.props.onPaneChange(this.paneIndex, pane)
      }
    },
    {
      deferFirstRun: true,
    },
  )
}
