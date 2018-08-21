import { react, on, isEqual } from '@mcro/black'
import { App, Electron } from '@mcro/stores'
import * as Helpers from '../helpers'
import { AppStore } from './AppStore'
import { logger } from '@mcro/logger'
import { QueryStore } from './QueryStore'
import { KeyboardStore } from './KeyboardStore'

const log = logger('selectionStore')
const isInRow = item =>
  item.moves.some(move => move === Direction.right || move === Direction.left)

enum Direction {
  left = 'left',
  right = 'right',
  up = 'up',
  down = 'down',
}

export type SelectionResult = {
  moves?: Direction[]
  item: any
}

export type SelectionGroup = {
  name?: string
  items: any[]
  type: 'row' | 'column'
  [key: string]: any
}

// selection store
export class SelectionStore {
  props: {
    appStore: AppStore
    queryStore: QueryStore
    keyboardStore: KeyboardStore
  }

  highlightIndex = -1
  lastPinKey = ''
  selectEvent = ''
  quickIndex = 0
  leaveIndex = -1
  lastSelectAt = 0
  _activeIndex = -1
  results: SelectionResult[] = null
  private resultsIn = null

  didMount() {
    on(this, this.props.keyboardStore, 'key', (key: string) => {
      if (Direction[key]) {
        this.setSelectEvent('key')
        this.move(Direction[key])
      }
      if (key === 'enter') {
        App.actions.openItem(this.selectedItem)
        App.actions.closeOrbit()
      }
    })

    this.props.appStore.onPinKey(key => {
      if (key === 'Delete') {
        this.props.queryStore.setQuery('')
        return
      }
      const { query } = this.props.queryStore
      if (!this.lastPinKey || this.lastPinKey != query[query.length - 1]) {
        this.props.queryStore.setQuery(key)
      } else {
        this.props.queryStore.setQuery(query + key)
      }
      // this.lastPinKey = key
    })
    const disposeAppListen = App.onMessage(App.messages.CLEAR_SELECTED, () => {
      this.clearSelected()
    })

    this.subscriptions.add({
      dispose: () => {
        disposeAppListen()
      },
    })
  }

  get activeIndex() {
    this.lastSelectAt
    return this._activeIndex
  }

  set activeIndex(val) {
    this.lastSelectAt = Date.now()
    this._activeIndex = val
  }

  get hasActiveIndex() {
    return this.activeIndex > -1
  }

  get selectedItem() {
    if (this.results) {
      return this.results[this.activeIndex].item
    }
    return null
  }

  clearSelectedOnSearch = react(
    () => this.props.queryStore.query,
    async (_, { sleep }) => {
      await sleep(16)
      this.clearSelected()
    },
  )

  clearSelectedOnLeave = react(
    () => [this.leaveIndex, Electron.hoverState.peekHovered],
    async ([leaveIndex, peekHovered], { sleep, when }) => {
      if (!peekHovered) {
        await sleep(100)
      }
      await when(() => !peekHovered)
      await sleep(100)
      if (leaveIndex === -1) {
        throw react.cancel
      }
      this.clearSelected()
    },
  )

  clearPeekOnInactiveIndex = react(
    () => this.activeIndex,
    () => {
      if (this.hasActiveIndex) {
        throw react.cancel
      }
      App.actions.clearPeek()
    },
  )

  clearSelectedOnClosePeek = react(
    () => App.peekState.target,
    target => {
      if (target || !this.hasActiveIndex) {
        throw react.cancel
      }
      log(`ok clearing ${target} ${this.hasActiveIndex} ${this.activeIndex}`)
      this.clearSelected()
    },
  )

  clearSelected = (clearPeek = true) => {
    this.leaveIndex = -1
    this.activeIndex = -1
    if (clearPeek) {
      App.actions.clearPeek()
    }
  }

  getHoverSettler = Helpers.hoverSettler({
    enterDelay: 40,
    betweenDelay: 40,
    onHovered: res => {
      // leave
      if (!res) {
        if (this.activeIndex !== -1) {
          this.leaveIndex = this.activeIndex
        }
        return
      }
      this.leaveIndex = -1
      this.toggleSelected(res.index)
    },
  })

  toggleSelected = (index, eventType?: string) => {
    if (eventType) {
      this.setSelectEvent(eventType)
    }
    const isSame = this.activeIndex === index && this.activeIndex > -1
    if (isSame && App.peekState.target) {
      if (Date.now() - this.lastSelectAt < 70) {
        // ignore really fast double clicks
        console.log('isSame, ignore', index, this.activeIndex)
        return isSame
      }
      this.clearSelected()
    } else {
      if (typeof index === 'number') {
        this.activeIndex = index
      }
    }
    return false
  }

  move = (direction: Direction) => {
    if (!this.results) {
      return
    }
    const activeIndex = this.getNextIndex(this.activeIndex, direction)
    if (activeIndex !== this.activeIndex) {
      this.toggleSelected(activeIndex)
    }
  }

  getNextIndex = (curIndex, direction: Direction) => {
    if (!this.results) {
      return -1
    }
    if (curIndex === 0 && direction === Direction.up) {
      return -1
    }
    if (curIndex === -1) {
      if (direction === Direction.down) {
        return this.results.length ? 0 : -1
      }
      return
    }
    const maxIndex = this.results.length - 1
    const curResult = this.results[curIndex]
    const nowInRow = isInRow(curResult)
    if (!nowInRow) {
      // move to begining of previous row if going up into it
      if (direction === Direction.up) {
        const prevIndex = curIndex - 1
        const prevIsRow = isInRow(this.results[prevIndex])
        if (prevIsRow) {
          const movesToNextRow = this.movesToNextRow(Direction.left, prevIndex)
          return prevIndex + movesToNextRow
        }
      }
      return Math.min(
        Math.max(-1, curIndex + (direction === Direction.up ? -1 : 1)),
        maxIndex,
      )
    }
    const canMoveOne =
      curResult && curResult.moves.some(move => move === direction)
    if (canMoveOne) {
      switch (direction) {
        case Direction.right:
          return curIndex + 1
        case Direction.left:
          return curIndex - 1
        default:
          const rowDirection =
            direction === Direction.down ? Direction.right : Direction.left
          const movesToNextRow = this.movesToNextRow(rowDirection, curIndex)
          return Math.min(maxIndex, curIndex + movesToNextRow)
      }
    }
    return curIndex
  }

  movesToNextRow = (dir, curIndex) => {
    const amt = dir === 'right' ? 1 : -1
    const all = this.results
    const hasMove = index => all[index] && all[index].moves.indexOf(dir) > -1
    let movesToNextRow = amt
    while (hasMove(curIndex + movesToNextRow)) {
      movesToNextRow += amt
    }
    if (dir === 'right') {
      movesToNextRow += amt
    }
    return movesToNextRow
  }

  setSelectEvent = (val: string) => {
    this.selectEvent = val
  }

  setResults = (resultGroups: SelectionGroup[]) => {
    this.resultsIn = resultGroups
    if (!resultGroups) {
      this.results = null
      return
    }
    // avoid unecessary updates
    if (isEqual(this.resultsIn, resultGroups)) {
      return
    }
    let results: SelectionResult[] = []
    // calculate moves
    const numGroups = resultGroups.length
    for (const [groupIndex, { items, type }] of resultGroups.entries()) {
      if (type === 'row') {
        const downMoves =
          groupIndex < numGroups
            ? [Direction.down, Direction.up]
            : [Direction.up]
        const nextMoves = items.map((item, index) => ({
          item,
          moves: [
            index < items.length - 1 ? Direction.right : null,
            index > 0 ? Direction.left : null,
            ...downMoves,
          ],
        }))
        results = [...results, ...nextMoves]
      }
      if (type === 'column') {
        const hasPrevResults = !!results.length
        const nextMoves = items.map((item, index) => {
          const moves = []
          if (index < items.length - 1) {
            moves.push(Direction.down)
          }
          if (hasPrevResults || index > 0) {
            moves.push(Direction.up)
          }
          return { moves, item }
        })
        results = [...results, ...nextMoves]
      }
    }
    this.results = results
  }

  getIndexForItem = id => {
    return this.results.findIndex(x => x.item.id === id)
  }

  openSelected = () => {
    if (this.selectedItem) {
      App.actions.openItem(this.selectedItem)
      return true
    }
    return false
  }

  setHighlightIndex = index => {
    this.highlightIndex = index
  }
}
