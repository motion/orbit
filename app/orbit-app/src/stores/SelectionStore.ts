import { ensure, react } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'
import { AppActions } from '../actions/AppActions'
import { SelectionGroup } from '../apps/SelectionResults'
import { hoverSettler } from '../helpers/hoverSettler'
import { SelectableListProps } from '../views/Lists/SelectableList'

const isInRow = item => item.moves.some(move => move === Direction.right || move === Direction.left)

export enum Direction {
  left = 'left',
  right = 'right',
  up = 'up',
  down = 'down',
}

export type MovesMap = {
  index: number
  shouldAutoSelect?: boolean
  moves?: Direction[]
}

export enum SelectEvent {
  key = 'key',
  click = 'click',
}

// TODO see why we had this here and redo later...
// App.onMessage(App.messages.CLEAR_SELECTED, () => {
//   this.clearSelected()
// })

export class SelectionStore {
  props: SelectableListProps

  selectEvent: SelectEvent = SelectEvent.click
  leaveIndex = -1
  lastSelectAt = 0
  _activeIndex = typeof this.props.defaultSelected === 'number' ? this.props.defaultSelected : -1
  movesMap: MovesMap[] | null = null

  get activeIndex() {
    this.lastSelectAt
    return this._activeIndex
  }

  set activeIndex(val) {
    this.lastSelectAt = Date.now()
    this._activeIndex = val
  }

  setActiveIndex = (val: number) => {
    this.activeIndex = val
  }

  get hasActiveIndex() {
    return this.activeIndex > -1
  }

  clearPeekOnInactiveIndex = react(
    () => this.activeIndex,
    () => {
      ensure('no active index', !this.hasActiveIndex)
      AppActions.clearPeek()
    },
    {
      deferFirstRun: true,
    },
  )

  clearSelected = () => {
    this.leaveIndex = -1
    this.setActiveIndex(-1)
  }

  getHoverSettler = hoverSettler({
    enterDelay: 40,
    betweenDelay: 40,
    onHovered(res) {
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

  clearSelectedOnLeave = react(
    () => [this.leaveIndex, Desktop.hoverState.appHovered],
    async ([leaveIndex, appHovered], { sleep, when }) => {
      if (!appHovered) {
        await sleep(100)
      }
      await when(() => !appHovered)
      await sleep(100)
      ensure('has leave index', leaveIndex > -1)
      this.clearSelected()
    },
  )

  toggleSelected = (index: number, eventType?: 'key' | 'click') => {
    if (eventType) {
      this.setSelectEvent(SelectEvent[eventType])
    }
    const isSame = this.activeIndex === index && this.activeIndex > -1
    if (isSame && App.peekState && App.peekState.target) {
      if (Date.now() - this.lastSelectAt < 70) {
        // ignore really fast double clicks
        console.log('isSame, ignore', index, this.activeIndex)
        return isSame
      }
      this.clearSelected()
    } else {
      if (typeof index !== 'number') {
        console.error('index is not a number', index)
      } else {
        this.setActiveIndex(index)
      }
    }
  }

  move = (direction: Direction, selectEvent = SelectEvent.key) => {
    if (!this.movesMap) {
      console.log('no SelectionStore.movesMap')
      return
    }
    this.setSelectEvent(selectEvent)
    const activeIndex = this.getNextIndex(this.activeIndex, direction)
    if (activeIndex !== this.activeIndex) {
      this.toggleSelected(activeIndex)
    }
  }

  getNextIndex = (curIndex: number, direction: Direction): number => {
    if (!this.movesMap) {
      return -1
    }
    if (curIndex === 0 && direction === Direction.up) {
      return -1
    }
    if (curIndex === -1) {
      if (direction === Direction.down) {
        return this.movesMap.length ? 0 : -1
      }
      return -1
    }
    const maxIndex = this.movesMap.length - 1
    const curResult = this.movesMap[curIndex]
    if (!curResult) {
      throw new Error(`No result at index ${curIndex}`)
    }
    const nowInRow = isInRow(curResult)
    if (!nowInRow) {
      // move to begining of previous row if going up into it
      if (direction === Direction.up) {
        const prevIndex = curIndex - 1
        const prevIsRow = isInRow(this.movesMap[prevIndex])
        if (prevIsRow) {
          const movesToNextRow = this.movesToNextRow(Direction.left, prevIndex)
          return prevIndex + movesToNextRow
        }
      }
      return Math.min(Math.max(-1, curIndex + (direction === Direction.up ? -1 : 1)), maxIndex)
    }
    const canMove = curResult && curResult.moves.some(move => move === direction)
    if (canMove) {
      switch (direction) {
        case Direction.right:
          return curIndex + 1
        case Direction.left:
          return curIndex - 1
        case Direction.up:
          const movesToPrevRow = this.movesToNextRow(Direction.left, curIndex)
          return curIndex + movesToPrevRow
        case Direction.down:
          const movesToNextRow = this.movesToNextRow(Direction.right, curIndex)
          const nextIndex = curIndex + movesToNextRow
          // if were in the last row already, avoid moving
          if (nextIndex > maxIndex) {
            return curIndex
          }
          return nextIndex
      }
    }
    return curIndex
  }

  movesToNextRow = (dir: Direction, curIndex: number) => {
    const amt = dir === Direction.right ? 1 : -1
    const all = this.movesMap
    const hasMove = (index: number) => all[index] && all[index].moves.indexOf(dir) > -1
    let movesToNextRow = amt
    while (hasMove(curIndex + movesToNextRow)) {
      movesToNextRow += amt
    }
    if (dir === Direction.right) {
      movesToNextRow += amt
    }
    return movesToNextRow
  }

  setSelectEvent = (val: SelectEvent) => {
    this.selectEvent = val
  }

  setResults = (resultGroups: SelectionGroup[]) => {
    // no results
    if (!resultGroups) {
      this.movesMap = null
      return
    }

    // is updated
    let results: MovesMap[] = []
    // calculate moves
    const numGroups = resultGroups.length
    for (const [groupIndex, selectionResult] of resultGroups.entries()) {
      const { indices, type, shouldAutoSelect } = selectionResult
      if (type === 'row') {
        const downMoves = groupIndex < numGroups ? [Direction.down, Direction.up] : [Direction.up]
        const nextMoves = indices.map(index => ({
          index,
          shouldAutoSelect,
          moves: [
            index < indices.length - 1 ? Direction.right : null,
            index > 0 ? Direction.left : null,
            ...downMoves,
          ].filter(Boolean),
        }))
        results = [...results, ...nextMoves]
      }
      if (type === 'column') {
        const hasPrevResults = !!results.length
        const nextMoves = indices.map((_, index) => {
          const moves = []
          if (index < indices.length - 1) {
            moves.push(Direction.down)
          }
          if (hasPrevResults || index > 0) {
            moves.push(Direction.up)
          }
          return { moves, index }
        })
        results = [...results, ...nextMoves]
      }
    }
    this.movesMap = results
  }

  getIndexForItem = (index: number) => {
    if (!this.movesMap) {
      throw new Error('Calling index before')
    }
    return this.movesMap.findIndex(x => x.index === index)
  }
}
