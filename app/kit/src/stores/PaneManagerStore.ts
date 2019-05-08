import { Direction } from '@o/ui'
import { ensure, react, ReactionRejectionError } from '@o/use-store'
import { memoize } from 'lodash'

export type PaneManagerPane = {
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
    defaultPanes: PaneManagerPane[]
    onPaneChange?: (index: number, pane: PaneManagerPane) => any
    defaultIndex?: number
  }

  next = null
  paneIndex = this.props.defaultIndex || 0
  panes = [...this.props.defaultPanes]

  syncPaneIndexProp = react(
    () => this.props.defaultIndex,
    index => {
      this.paneIndex = index
    },
    {
      deferFirstRun: true,
    },
  )

  setPanes(panes: PaneManagerPane[]) {
    this.panes = panes
  }

  get activePaneFast(): PaneManagerPane {
    return this.panes[this.paneIndex] || this.lastActivePane
  }

  activePane = react(() => this.activePaneFast, {
    delay: 16,
    log: false,
    defaultValue: this.activePaneFast,
  })

  get activePaneId() {
    return (this.activePane && this.activePane.id) || ''
  }

  lastActivePane = react(() => this.activePane, _ => _, {
    delayValue: true,
    log: false,
  })

  // didMount() {
  //   on(this, autoTrack(this, ['paneIndex']))
  // }

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
      console.error(`Error moving ${e.message}`)
    }
  }

  private setNextPane<A extends keyof PaneManagerPane>(attr: A, val: PaneManagerPane[A]) {
    this.next = { attr, val }
  }

  setPaneWhenReady = react(
    () => [this.next, this.panes],
    async ([next]) => {
      ensure('this.next', !!next)
      ensure('has pane', this.getPaneAtIndex(next) >= 0)
      this.setPane(next)
    },
  )

  private getPaneAtIndex = ({ attr, val }) => this.panes.findIndex(pane => pane[attr] === val)

  private setPane = ({ attr, val }) => {
    const index = this.getPaneAtIndex({ attr, val })
    try {
      this.setPaneIndex(index)
    } catch (err) {
      console.error(`Pane error, ${attr} ${val} ${err.message}`)
    }
  }

  // set pane functions
  setActivePane = (id: string) => this.setNextPane('id', id)
  setActivePaneByName = (name: string) => this.setNextPane('name', name)
  setActivePaneByType = (type: string) => this.setNextPane('type', type)
  activePaneSetter = memoize((id: string) => () => this.setActivePane(id))
  activePaneByNameSetter = memoize((name: string) => () => this.setActivePaneByName(name))
  activePaneByTypeSetter = memoize((type: string) => () => this.setActivePaneByType(type))

  setNextPaneKeyableIndex(index: number) {
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
      throw new Error(`Invalid pane index ${index}`)
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
