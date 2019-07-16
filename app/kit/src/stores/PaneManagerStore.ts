import { Direction } from '@o/ui'
import { ensure, react, ReactionRejectionError } from '@o/use-store'

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
  // @ts-ignore
  props: {
    defaultPanes: PaneManagerPane[]
    defaultPaneId: string
    disabled?: boolean
  }

  paneId = this.props.defaultPaneId
  panes = [...(this.props.defaultPanes || [])]

  syncPaneIndexProp = react(
    () => this.props.defaultPaneId,
    index => {
      this.paneId = index
    },
  )

  setPanes(panes: PaneManagerPane[]) {
    this.panes = panes
  }

  get activePaneFast(): PaneManagerPane {
    return (
      this.panes.find(x => x.id === this.paneId) ||
      this.panes.find(x => x.id === this.lastActivePaneId) ||
      this.panes[0] ||
      (this.props.defaultPanes || [])[0]
    )
  }

  activePaneSlow = react(() => this.activePaneFast, _ => _, {
    delay: 80,
    defaultValue: this.activePaneFast,
  })

  get activePane() {
    return this.activePaneFast
  }

  setPane = (id: string) => {
    if (this.panes.some(pane => pane.id === id)) {
      this.paneId = id
    }
  }

  lastActivePaneId = react(
    () => this.activePane,
    pane => {
      ensure('pane', !!pane)
      return pane.id
    },
    {
      defaultValue: this.activePane ? this.activePane.id : undefined,
      delayValue: true,
      log: false,
    },
  )

  get paneIndex() {
    return this.panes.findIndex(x => x.id === this.paneId)
  }

  move = (direction: Direction) => {
    if (this.props.disabled) {
      return
    }
    try {
      let next
      if (direction === Direction.right) {
        next = this.panes[this.paneIndex + 1]
      }
      if (direction === Direction.left) {
        next = this.panes[this.paneIndex - 1]
      }

      ensure('keyable', next && next.keyable)
      this.setPane(next.id)
    } catch (e) {
      if (e instanceof ReactionRejectionError) {
        console.debug('Not in keyable range')
        return
      }
      console.error(`Error moving ${e.message}`)
    }
  }

  setNextPaneKeyableIndex(index: number) {
    this.setPane(this.panes.filter(x => x.keyable && !x.isHidden)[index].id)
  }

  indexOfPane = (id: string) => {
    return this.panes.findIndex(x => x.id === id)
  }
}
