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

  next = null
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
      this.panes.find(x => x.id === this.lastActivePaneId)
    )
  }

  activePane = react(() => this.activePaneFast, {
    delay: 16,
    log: false,
    defaultValue: this.activePaneFast,
  })

  lastActivePaneId = react(() => this.activePane.id, _ => _, {
    delayValue: true,
    log: false,
  })

  back = () => {
    if (this.lastActivePaneId) {
      this.setPane(this.lastActivePaneId)
    }
  }

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

  // set pane functions
  setPane = (id: string) => {
    this.setNextPane('id', id)
  }

  setNextPaneKeyableIndex(index: number) {
    this.setPane(this.panes.filter(x => x.keyable && !x.isHidden)[index].id)
  }

  indexOfPane = (id: string) => {
    return this.panes.findIndex(x => x.id === id)
  }
}
