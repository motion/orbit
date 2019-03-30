import { ensure, react, useStore } from '@o/use-store'
import { pick } from 'lodash'
import { TableHighlightedRows } from '../tables/types'
import { GenericDataRow } from '../types'
import { DynamicListControlled } from './DynamicList'

export enum Direction {
  up = 'up',
  down = 'down',
}

export type SelectableProps = {
  onSelectIndices?: (keys: TableHighlightedRows) => void
  alwaysSelected?: boolean
  disableSelect?: boolean
  selectable?: 'multi' | boolean
}

type Modifiers = {
  shift?: boolean
  option?: boolean
}

export function useSelectableStore(props: SelectableProps) {
  return useStore(
    SelectableStore,
    pick(props, 'onSelectIndices', 'alwaysSelected', 'disableSelect', 'selectable'),
  )
}

export class SelectableStore {
  props: SelectableProps

  callbackOnSelectProp = react(
    () => (this.active ? this.props.onSelectIndices : null),
    cb => (cb ? cb(Array.from(this.active)) : null),
  )

  dragStartIndex?: number = null
  rows = []
  active = new Set()
  lastEnter = -1
  listRef: DynamicListControlled = null

  enforceAlwaysSelected = react(
    () => [this.props.alwaysSelected, this.active.size === 0, this.rows.length > 0],
    ([alwaysSelected, noSelection, hasRows]) => {
      ensure('alwaysSelected', alwaysSelected)
      ensure('noSelection', noSelection)
      ensure('hasRows', hasRows)
      this.active = new Set([this.rows[0].key])
    },
  )

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

  setListRef(ref: DynamicListControlled) {
    this.listRef = ref
  }

  setRowActive(row: GenericDataRow, index: number, e?: React.MouseEvent) {
    if (e.button !== 0 || this.props.disableSelect) {
      // set active only with primary mouse button, dont interfere w/context menus
      return
    }
    if (e.shiftKey) {
      // prevent text selection
      e.preventDefault()
    }
    let active = this.active
    this.dragStartIndex = index
    document.addEventListener('mouseup', this.onStopDragSelecting)
    const modifiers = this.getModifiers(e)

    if (modifiers.option && this.props.selectable === 'multi') {
      // option select
      if (active.has(row.key)) {
        // remove
        active.delete(row.key)
        active = new Set([...active])
      } else {
        // add
        active = new Set([...active, row.key])
      }
    } else if (modifiers.shift && this.props.selectable === 'multi') {
      // range select
      const lastItemKey = Array.from(this.active).pop()
      active = new Set([...active, ...this.selectInRange(lastItemKey, row.key)])
    } else {
      // single select
      active = new Set([row.key])
    }
    this.active = active
  }

  onHoverRow(row: GenericDataRow, index: number) {
    if (this.props.disableSelect || this.props.selectable !== 'multi') {
      return
    }
    const { dragStartIndex } = this
    if (typeof dragStartIndex === 'number') {
      const startKey = this.rows[dragStartIndex].key
      this.active = new Set(this.selectInRange(startKey, row.key))
      const direction = this.lastEnter > index ? Direction.up : Direction.down
      this.lastEnter = index
      this.scrollToIndex(index)
      return direction
    }
    return false
  }

  onKeyDown = (e: KeyboardEvent) => {
    if (this.active.size === 0) {
      return
    }
    const direction = e.keyCode === 38 ? Direction.up : e.keyCode === 40 ? Direction.down : null
    if (direction && !this.props.disableSelect) {
      const newIndex = this.move(direction, { shift: e.shiftKey })
      if (this.listRef) {
        this.listRef.scrollToIndex(newIndex)
      }
    }
  }

  clearSelected = () => {
    this.active = new Set()
  }

  setRows(next: any[]) {
    this.rows = next
  }

  private scrollToIndex(index: number) {
    if (!this.listRef) return
    this.listRef.scrollToIndex(index)
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

  private getModifiers(e?: React.MouseEvent): Modifiers {
    if (e) {
      return {
        option:
          (e.metaKey && process.platform === 'darwin') ||
          (e.ctrlKey && process.platform !== 'darwin'),
        shift: e.shiftKey,
      }
    }
    return {
      option: false,
      shift: false,
    }
  }
}
