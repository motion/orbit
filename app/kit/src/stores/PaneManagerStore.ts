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
  props: {
    defaultPanes: PaneManagerPane[]
    defaultPaneId: string
    disabled?: boolean
  }

  paneId = this.props.defaultPaneId
  panes = [...this.props.defaultPanes]

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
      this.panes[0]
    )
  }

  activePane = react(() => this.activePaneFast, {
    delay: 16,
    log: false,
    defaultValue: this.activePaneFast,
  })

  // set pane functions
  setPane = (id: string) => {
    this.paneId = id
  }

  lastActivePaneId = react(() => this.activePane.id, _ => _, {
    delayValue: true,
    log: false,
  })

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
