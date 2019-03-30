import { react } from '@o/use-store'
import { TableHighlightedRows } from '../tables/types'
import { GenericDataRow } from '../types'

export enum Direction {
  up = 'up',
  down = 'down',
}

export type MultiSelectProps = {
  onSelectIndices?: (keys: TableHighlightedRows) => void
  disableSelect?: boolean
  multiSelect?: boolean
}

type Modifiers = {
  shift?: boolean
  option?: boolean
}

export class MultiSelectStore {
  props: MultiSelectProps

  callbackOnSelectProp = react(
    () => (this.active ? this.props.onSelectIndices : null),
    cb => (cb ? cb(Array.from(this.active)) : null),
  )

  dragStartIndex?: number = null
  rows = []
  active = new Set()
  lastEnter = -1

  move(direction: Direction, modifiers: Modifiers) {
    const { rows, active } = this
    if (active.size === 0) {
      return
    }
    const lastItemKey = Array.from(active).pop()
    const lastItemIndex = rows.findIndex(row => row.key === lastItemKey)
    const newIndex = Math.min(
      rows.length - 1,
      Math.max(0, direction === Direction.up ? lastItemIndex - 1 : lastItemIndex + 1),
    )
    if (modifiers.shift === false) {
      active.clear()
    }
    active.add(rows[newIndex].key)
    if (!this.props.disableSelect) {
      this.active = active
    }
    return newIndex
  }

  onPressRow(row: GenericDataRow, index: number, modifiers: Modifiers) {
    let active = this.active
    this.dragStartIndex = index
    document.addEventListener('mouseup', this.onStopDragSelecting)
    if (modifiers.option && this.props.multiSelect) {
      // option select
      if (active.has(row.key)) {
        // remove
        active.delete(row.key)
        active = new Set([...active])
      } else {
        // add
        active = new Set([...active, row.key])
      }
    } else if (modifiers.shift && this.props.multiSelect) {
      // range select
      const lastItemKey = Array.from(this.active).pop()
      active = new Set([...active, ...this.selectInRange(lastItemKey, row.key)])
    } else {
      // single select
      active = new Set([row.key])
    }
    this.active = active
  }

  onEnterRow(row: GenericDataRow, index: number) {
    if (this.props.disableSelect || !this.props.multiSelect) {
      return
    }
    const { dragStartIndex } = this
    if (typeof dragStartIndex === 'number') {
      const startKey = this.rows[dragStartIndex].key
      this.active = new Set(this.selectInRange(startKey, row.key))
      const direction = this.lastEnter > index ? Direction.up : Direction.down
      this.lastEnter = index
      return direction
    }
    return false
  }

  private selectInRange = (fromKey: string, toKey: string): Array<string> => {
    const { rows } = this
    const selected = []
    let startIndex = -1
    let endIndex = -1
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].key === fromKey) {
        startIndex = i
      }
      if (rows[i].key === toKey) {
        endIndex = i
      }
      if (endIndex > -1 && startIndex > -1) {
        break
      }
    }
    for (let i = Math.min(startIndex, endIndex); i <= Math.max(startIndex, endIndex); i++) {
      try {
        selected.push(rows[i].key)
      } catch (e) {}
    }
    return selected
  }

  private onStopDragSelecting = () => {
    this.dragStartIndex = null
    document.removeEventListener('mouseup', this.onStopDragSelecting)
  }
}
