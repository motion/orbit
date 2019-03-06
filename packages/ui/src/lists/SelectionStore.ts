import { react } from '@mcro/use-store'
import {
  Direction,
  MovesMap,
  SelectEvent,
  SelectionGroup,
  SelectionStoreProps,
} from './ProvideSelectionStore'

const isInRow = item =>
  item.moves.some((move: string) => move === Direction.right || move === Direction.left)

type Props = Pick<SelectionStoreProps, 'isActive' | 'minSelected' | 'onSelect' | 'defaultSelected'>

export class SelectionStore {
  props: Props
  childProps: Partial<Props> = {}

  // we allow children to update props
  get finalProps() {
    return {
      ...this.props,
      ...this.childProps,
    }
  }

  setChildProps(childProps: Props) {
    this.childProps = childProps
  }

  selectEvent: SelectEvent = SelectEvent.click
  lastSelectAt = 0
  _activeIndex = -1
  movesMap: MovesMap[] | null = null
  originalItems = null

  get isActive() {
    return typeof this.finalProps.isActive === 'boolean' ? this.finalProps.isActive : true
  }

  get activeIndex() {
    this.lastSelectAt
    return this._activeIndex
  }

  set activeIndex(val) {
    this.lastSelectAt = Date.now()
    this._activeIndex = val
  }

  get activeId() {
    if (this.activeIndex === -1 || !this.movesMap) {
      return null
    }
    return this.movesMap[this.activeIndex].id
  }

  setActiveIndex = (val: number) => {
    this.activeIndex = Math.max(
      typeof this.finalProps.minSelected === 'number' ? this.finalProps.minSelected : -1,
      val,
    )
  }

  setOriginalItems = (items: { id: any }[]) => {
    this.originalItems = items
  }

  get currentItems() {
    if (!this.originalItems) {
      return null
    }
    return this.movesMap.map(x => this.originalItems.find(item => item.id === x.id))
  }

  get hasActiveIndex() {
    return this.activeIndex > -1
  }

  clearSelected = () => {
    this.setActiveIndex(-1)
  }

  setSelected = (index: number, eventType?: 'key' | 'click') => {
    if (eventType) {
      this.setSelectEvent(SelectEvent[eventType])
    }
    const isSame = this.activeIndex === index && this.activeIndex > -1
    if (!isSame) {
      if (typeof index !== 'number') {
        console.error('index is not a number', index)
      } else {
        this.setActiveIndex(index)
      }
    }
  }

  activeIndexDefaultEffect = react(
    () => {
      const { defaultSelected, minSelected } = this.finalProps
      if (typeof defaultSelected === 'number') {
        return defaultSelected
      }
      if (typeof minSelected === 'number') {
        return minSelected
      }
      return -1
    },
    next => {
      this._activeIndex = next
    },
  )

  moveToId = (id: any) => {
    const move = this.movesMap.find(x => x.id === id)
    if (!move) {
      console.warn('Not found', id, this.movesMap)
      return
    }
    console.log('moving to', move)
    this.setSelected(move.index)
  }

  move = (direction: Direction, selectEvent = SelectEvent.key) => {
    if (!this.movesMap) {
      console.log('no SelectionStore.movesMap')
      return
    }
    this.setSelectEvent(selectEvent)
    const activeIndex = this.getNextIndex(this.activeIndex, direction)
    if (activeIndex !== this.activeIndex) {
      this.setSelected(activeIndex)
    }
  }

  private getNextIndex(curIndex: number, direction: Direction): number {
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
          const movesToNextRow = this.getMovesToNextRow(Direction.left, prevIndex)
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
          const movesToPrevRow = this.getMovesToNextRow(Direction.left, curIndex)
          return curIndex + movesToPrevRow
        case Direction.down:
          const movesToNextRow = this.getMovesToNextRow(Direction.right, curIndex)
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

  private getMovesToNextRow(dir: Direction, curIndex: number) {
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

  setSelectionResults = (resultGroups: SelectionGroup[]) => {
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
      const { items, type, shouldAutoSelect } = selectionResult
      if (type === 'row') {
        const downMoves = groupIndex < numGroups ? [Direction.down, Direction.up] : [Direction.up]
        const nextMoves = items.map(move => ({
          id: move.id,
          index: move.index,
          shouldAutoSelect,
          moves: [
            move.index < items.length - 1 ? Direction.right : null,
            move.index > 0 ? Direction.left : null,
            ...downMoves,
          ].filter(Boolean),
        }))
        results = [...results, ...nextMoves]
      }
      if (type === 'column') {
        const hasPrevResults = !!results.length
        const nextMoves = items.map(({ id, index }) => {
          const moves = []
          if (index < moves.length - 1) {
            moves.push(Direction.down)
          }
          if (hasPrevResults || index > 0) {
            moves.push(Direction.up)
          }
          return { moves, index, id }
        })
        results = [...results, ...nextMoves]
      }
    }

    this.movesMap = results

    // also we'll need to trigger the onSelect callback in case the item changed
    // this is pretty weird, we are trigger updates from multiple places and all
    // are a bit wierd. we should unify in one area i think, likely in this store
    if (this.hasActiveIndex) {
      if (this.finalProps.onSelect) {
        this.finalProps.onSelect(this.activeIndex, this.selectEvent)
      }
    }
  }

  getIndexForItem = (index: number) => {
    if (!this.movesMap) {
      throw new Error('Calling index before')
    }
    return this.movesMap.findIndex(x => x.index === index)
  }
}
