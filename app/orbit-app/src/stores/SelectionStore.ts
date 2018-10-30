import { react, ensure } from '@mcro/black'
import { App, Electron } from '@mcro/stores'
import { QueryStore } from './QueryStore/QueryStore'
import { Actions } from '../actions/Actions'
import { hoverSettler } from '../helpers'
import { ResolvableModel } from '../integrations/types'

const isInRow = item => item.moves.some(move => move === Direction.right || move === Direction.left)
const resultsKey = (x: SelectionGroup[]) => x.map(y => y.ids.join('')).join('')

export enum Direction {
  left = 'left',
  right = 'right',
  up = 'up',
  down = 'down',
}

export type MovesMap = {
  id: number
  shouldAutoSelect?: boolean
  moves?: Direction[]
}

export type SelectionGroup = {
  name?: string
  shouldAutoSelect?: boolean
  ids: number[]
  items?: ResolvableModel[] // optionally store full items...
  type: 'row' | 'column'
  startIndex?: number
  [key: string]: any
}

// selection store
export class SelectionStore {
  props: {
    queryStore: QueryStore
  }

  lastMove = { at: 0, direction: Direction.down }
  highlightIndex = -1
  selectEvent = ''
  leaveIndex = -1
  lastSelectAt = 0
  _activeIndex = -1
  movesMap: MovesMap[] | null = null
  private lastResultsKey = ''
  clearOff: any

  didMount() {
    this.clearOff = App.onMessage(App.messages.CLEAR_SELECTED, () => {
      this.clearSelected()
    })
  }

  willUnmount() {
    this.clearOff()
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

  setSelectedOnSearch = react(
    () => this.movesMap && App.state.query && Math.random(),
    async (_, { sleep }) => {
      ensure('query', !!App.state.query)
      const hasResults = this.movesMap && !!this.movesMap.length
      // select first item on search
      if (hasResults) {
        ensure('results should auto select', this.movesMap[0].shouldAutoSelect)
        // dont be too too aggressive with the popup
        await sleep(200)
        console.log('selecting first result automatically', this.movesMap)
        this.activeIndex = 0
      } else {
        this.clearSelected()
      }
    },
  )

  clearPeekOnInactiveIndex = react(
    () => this.activeIndex,
    () => {
      ensure('no active index', !this.hasActiveIndex)
      Actions.clearPeek()
    },
    {
      deferFirstRun: true,
    },
  )

  clearSelectedOnClosePeek = react(
    () => !!App.peekState && !!App.peekState.target,
    target => {
      ensure('no target and active index', !target && this.hasActiveIndex)
      this.clearSelected()
    },
  )

  clearSelected = () => {
    this.leaveIndex = -1
    this.activeIndex = -1
  }

  getHoverSettler = hoverSettler({
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

  clearSelectedOnLeave = react(
    () => [this.leaveIndex, Electron.hoverState.peekHovered],
    async ([leaveIndex, peekHovered], { sleep, when }) => {
      if (!peekHovered) {
        await sleep(100)
      }
      await when(() => !peekHovered)
      await sleep(100)
      ensure('has leave index', leaveIndex > -1)
      this.clearSelected()
    },
  )

  toggleSelected = (index, eventType?: string) => {
    if (eventType) {
      this.setSelectEvent(eventType)
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
      if (typeof index === 'number') {
        this.activeIndex = index
      }
    }
    return false
  }

  move = (direction: Direction, selectEvent?: 'key') => {
    if (!this.movesMap) {
      return
    }
    if (selectEvent) {
      this.lastMove = { at: Date.now(), direction }
      this.setSelectEvent(selectEvent)
    }
    const activeIndex = this.getNextIndex(this.activeIndex, direction)
    if (activeIndex !== this.activeIndex) {
      this.toggleSelected(activeIndex)
    }
  }

  getNextIndex = (curIndex, direction: Direction) => {
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
      return
    }
    const maxIndex = this.movesMap.length - 1
    const curResult = this.movesMap[curIndex]
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

  movesToNextRow = (dir, curIndex) => {
    const amt = dir === 'right' ? 1 : -1
    const all = this.movesMap
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
    // no results
    if (!resultGroups) {
      this.lastResultsKey = ''
      this.movesMap = null
      return
    }

    // not updated
    const nextKey = resultsKey(resultGroups)
    if (nextKey === this.lastResultsKey) {
      return
    }
    this.lastResultsKey = nextKey

    // is updated
    let results: MovesMap[] = []
    // calculate moves
    const numGroups = resultGroups.length
    for (const [groupIndex, selectionResult] of resultGroups.entries()) {
      const { ids, type, shouldAutoSelect } = selectionResult
      if (type === 'row') {
        const downMoves = groupIndex < numGroups ? [Direction.down, Direction.up] : [Direction.up]
        const nextMoves = ids.map((id, index) => ({
          id,
          shouldAutoSelect,
          moves: [
            index < ids.length - 1 ? Direction.right : null,
            index > 0 ? Direction.left : null,
            ...downMoves,
          ].filter(Boolean),
        }))
        results = [...results, ...nextMoves]
      }
      if (type === 'column') {
        const hasPrevResults = !!results.length
        const nextMoves = ids.map((id, index) => {
          const moves = []
          if (index < ids.length - 1) {
            moves.push(Direction.down)
          }
          if (hasPrevResults || index > 0) {
            moves.push(Direction.up)
          }
          return { moves, id }
        })
        results = [...results, ...nextMoves]
      }
    }
    this.movesMap = results
  }

  getIndexForItem = id => {
    if (!this.movesMap) {
      throw new Error('Calling index before')
    }
    return this.movesMap.findIndex(x => x.id === id)
  }

  setHighlightIndex = index => {
    this.highlightIndex = index
  }
}
