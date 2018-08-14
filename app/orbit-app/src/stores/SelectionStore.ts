import { react, on } from '@mcro/black'
import { App, Electron } from '@mcro/stores'
import * as Helpers from '../helpers'
import { AppStore } from './AppStore'
import { logger } from '@mcro/logger'
import { QueryStore } from './QueryStore'
import { KeyboardStore } from './KeyboardStore'

const log = logger('selectionStore')

enum Direction {
  left,
  right,
  up,
  down,
}

export type SelectionResult = {
  moves?: Direction[]
  item: any
}

export type SelectionGroup = {
  name: string
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
  nextIndex = -1
  leaveIndex = -1
  lastSelectAt = 0
  _activeIndex = -1
  results: SelectionResult[] = null

  didMount() {
    on(this, this.props.keyboardStore, 'key', key => {
      if (Direction[key]) {
        this.move(key)
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

  // delay for speed of rendering
  updateActiveIndexToNextIndex = react(
    () => this.nextIndex,
    async (i, { sleep }) => {
      await sleep(32)
      this.activeIndex = i
    },
  )

  clearSelected = (clearPeek = true) => {
    this.leaveIndex = -1
    this.nextIndex = -1
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

  toggleSelected = index => {
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
        this.nextIndex = index
      }
    }
    return false
  }

  move = (direction: Direction) => {
    if (!this.results) {
      throw new Error('No results')
    }
    const nextIndex = this.getNextIndex(this.activeIndex, direction)
    console.log('nextIndex', nextIndex)
    if (nextIndex !== this.activeIndex) {
      this.toggleSelected(nextIndex)
    }
  }

  getNextIndex = (curIndex, direction) => {
    if (curIndex === -1) {
      if (direction === Direction.down) {
        return this.results.length ? 0 : -1
      }
      return
    }
    const curResult = this.results[curIndex]
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
          return curIndex + movesToNextRow
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
      this.props.appStore.open(this.selectedItem)
      return true
    }
    return false
  }

  setHighlightIndex = index => {
    this.highlightIndex = index
  }
}
