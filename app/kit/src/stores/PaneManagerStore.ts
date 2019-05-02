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

  get activePane(): PaneManagerPane {
    return this.panes[this.paneIndex] || this.lastActivePane
  }

  get homePane() {
    return this.panes.find(x => x.type === 'search')
  }

  get isOnHome() {
    const searchPane = this.panes.find(x => x.type === 'search')
    return searchPane && this.activePane.id === searchPane.id
  }

  activePaneLowPriority = react(() => this.activePane, _ => _, { delay: 1, log: false })

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
      throw e
    }
  }

  private setPaneBy<A extends keyof PaneManagerPane>(attr: A, val: PaneManagerPane[A]) {
    const index = this.panes.findIndex(pane => pane[attr] === val)
    if (index === -1) {
      // debugger
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
      // debugger
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
