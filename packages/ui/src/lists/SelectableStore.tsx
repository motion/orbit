import { always, ensure, react, useStore } from '@o/use-store'
import { pick } from 'lodash'
import { Config } from '../helpers/configure'
import { TableHighlightedRows } from '../tables/types'
import { GenericDataRow } from '../types'
import { DynamicListControlled } from './DynamicList'

const key = (item: any, index: number) => Config.getItemKey(item, index)

export enum Direction {
  up = 'up',
  down = 'down',
  right = 'right',
  left = 'left',
}

export type SelectableProps = {
  onSelectIndices?: (keys: TableHighlightedRows) => void
  alwaysSelected?: boolean
  selectable?: 'multi' | boolean
}

type Modifiers = {
  shift?: boolean
  option?: boolean
}

export function useSelectableStore(props: SelectableProps) {
  return useStore(SelectableStore, pick(props, 'onSelectIndices', 'alwaysSelected', 'selectable'))
}

export class SelectableStore {
  props: SelectableProps

  dragStartIndex?: number = null
  rows = []
  active = new Set()
  lastEnter = -1
  listRef: DynamicListControlled = null

  private setActive(next: string[]) {
    this.active = new Set(next)
  }

  callbackOnSelectProp = react(
    () => always(this.active),
    () => {
      ensure('selectIndices', !!this.props.onSelectIndices)
      this.props.onSelectIndices([...this.active])
    },
  )

  enforceAlwaysSelected = react(
    () => [this.props.alwaysSelected, this.active.size === 0, this.rows.length > 0],
    ([alwaysSelected, noSelection, hasRows]) => {
      ensure('alwaysSelected', alwaysSelected)
      ensure('noSelection', noSelection)
      ensure('hasRows', hasRows)
      this.setActive([this.getIndexKey(0)])
    },
  )

  move = (direction: Direction, modifiers: Modifiers = { shift: false }) => {
    const { rows, active } = this
    if (active.size === 0) {
      return
    }
    const lastItemKey = Array.from(active).pop()
    const lastItemIndex = rows.findIndex((row, i) => key(row, i) === lastItemKey)
    const newIndex = Math.min(
      rows.length - 1,
      Math.max(0, direction === Direction.up ? lastItemIndex - 1 : lastItemIndex + 1),
    )
    if (modifiers.shift === false) {
      active.clear()
    }
    active.add(this.getIndexKey(newIndex))
    if (!!this.props.selectable) {
      this.setActive([...active])
    }
    return newIndex
  }

  setListRef(ref: DynamicListControlled) {
    this.listRef = ref
  }

  setActiveIndex = (index: number) => {
    if (index === -1) {
      this.setActive([])
    } else {
      if (!this.rows.length) return
      this.setActive([this.getIndexKey(index)])
    }
  }

  isActiveIndex = (index: number) => {
    if (!this.rows.length) return false
    if (index === -1) return false
    return this.active.has(this.getIndexKey(index))
  }

  setRowActive(index: number, e?: React.MouseEvent) {
    const row = this.rows[index]
    const rowKey = key(row, index)
    if (e.button !== 0 || !this.props.selectable) {
      // set active only with primary mouse button, dont interfere w/context menus
      return
    }
    if (e.shiftKey) {
      // prevent text selection
      e.preventDefault()
    }
    let next = []
    const { active } = this
    this.dragStartIndex = index
    document.addEventListener('mouseup', this.onStopDragSelecting)
    const modifiers = this.getModifiers(e)

    if (modifiers.option && this.props.selectable === 'multi') {
      // option select
      if (active.has(rowKey)) {
        // remove
        active.delete(rowKey)
        next = [...active]
      } else {
        // add
        next = [...active, rowKey]
      }
    } else if (modifiers.shift && this.props.selectable === 'multi') {
      // range select
      const lastItemKey = Array.from(this.active).pop()
      next = [...active, ...this.selectInRange(lastItemKey, rowKey)]
    } else {
      // single select
      next = [rowKey]
    }

    this.setActive(next)
  }

  onHoverRow(index: number) {
    const row = this.rows[index]
    const rowKey = key(row, index)
    if (!this.props.selectable) {
      return false
    }
    const direction = this.lastEnter > index ? Direction.up : Direction.down
    this.lastEnter = index
    const { dragStartIndex } = this
    const isMouseDown = typeof dragStartIndex === 'number'
    if (isMouseDown) {
      if (this.props.selectable === 'multi') {
        const startKey = this.getIndexKey(dragStartIndex)
        this.setActive(this.selectInRange(startKey, rowKey))
        this.scrollToIndex(index)
        return direction
      } else {
        this.setActive([rowKey])
        return direction
      }
    }
  }

  onKeyDown = (e: KeyboardEvent) => {
    if (this.active.size === 0 || !this.props.selectable) {
      return
    }
    const direction = e.keyCode === 38 ? Direction.up : e.keyCode === 40 ? Direction.down : null
    if (direction) {
      const newIndex = this.move(direction, { shift: e.shiftKey })
      this.scrollToIndex(newIndex)
    }
  }

  clearSelected = () => {
    this.setActive([])
  }

  setRows(next: GenericDataRow[]) {
    this.rows = next
  }

  private getIndexKey(index: number) {
    return key(this.rows[index], index)
  }

  private scrollToIndex(index: number) {
    if (!this.listRef) return
    if (index === -1) return
    this.listRef.scrollToIndex(index)
  }

  private selectInRange = (fromKey: string, toKey: string): string[] => {
    const { rows } = this
    const selected = []
    let startIndex = -1
    let endIndex = -1
    for (let i = 0; i < rows.length; i++) {
      const rowKey = this.getIndexKey(i)
      if (rowKey === fromKey) {
        startIndex = i
      }
      if (rowKey === toKey) {
        endIndex = i
      }
      if (endIndex > -1 && startIndex > -1) {
        break
      }
    }
    for (let i = Math.min(startIndex, endIndex); i <= Math.max(startIndex, endIndex); i++) {
      try {
        selected.push(this.getIndexKey(i))
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
