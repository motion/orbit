import { always, ensure, react, useStore } from '@o/use-store'
import { isDefined } from '@o/utils'
import { omit, pick } from 'lodash'
import { MutableRefObject } from 'react'
import { Config } from '../helpers/configure'
import { GenericDataRow } from '../types'
import { DynamicListControlled } from './DynamicList'

const key = (item: any) => Config.getItemKey(item)

export enum Direction {
  up = 'up',
  down = 'down',
  right = 'right',
  left = 'left',
}

export type SelectableProps = {
  selectableStore?: SelectableStore
  selectableStoreRef?: MutableRefObject<SelectableStore>
  onSelect?: (rows: any[], indices?: number[]) => void
  alwaysSelected?: boolean
  defaultSelected?: number
  selectable?: 'multi' | boolean
}

export const selectablePropKeys = [
  'onSelect',
  'alwaysSelected',
  'selectable',
  'selectableStore',
  'defaultSelected',
  'selectableStoreRef',
]

type Modifiers = {
  shift?: boolean
  option?: boolean
}

export function pickSelectableProps(props: any) {
  return pick(props, ...selectablePropKeys)
}

export function omitSelectableProps(props: any) {
  return omit(props, ...selectablePropKeys)
}

// will grab the parent store if its provided, otherwise create its own
export function useSelectableStore(props: SelectableProps, options = { react: false }) {
  const propStore = props.selectableStore
  const newStore = useStore(
    propStore ? false : SelectableStore,
    pickSelectableProps(props),
    options,
  )
  return propStore || newStore
}

export class SelectableStore {
  props: SelectableProps

  dragStartIndex?: number = null
  rows = []
  active = new Set()
  lastEnter = -1
  listRef: DynamicListControlled = null
  private keyToIndex = {}

  private setActive(next: string[]) {
    // update keyToIndex
    for (const rowKey of next) {
      this.keyToIndex[rowKey] =
        this.keyToIndex[rowKey] || this.rows.findIndex(r => key(r) === rowKey)
    }

    // check for disabled rows
    const nextFiltered = next.filter(k => {
      const row = this.rows[this.keyToIndex[k]]
      if (row && row.selectable === false) {
        console.warn('unselectable', row)
        return false
      }
      return true
    })

    // if we filtered out everything, avoid doing anything
    if (next.length > 0 && nextFiltered.length === 0) {
      return
    }

    this.active = new Set(nextFiltered)
  }

  callbackRefProp = react(
    () => this.props.selectableStoreRef,
    ref => {
      ensure('onSelectableStore', !!ref)
      ref.current = this
    },
  )

  callbackOnSelectProp = react(
    () => always(this.active),
    async (_, { sleep }) => {
      // TODO this should really be handled by concurrent
      await sleep(16)
      ensure('onSelect', !!this.props.onSelect)
      this.callbackOnSelect()
    },
    {
      deferFirstRun: true,
    },
  )

  defaultSelectedProp = react(
    () => this.props.defaultSelected,
    async (index, { when }) => {
      ensure('defined', isDefined(index))
      await when(() => !!this.rows.length)
      this.setActiveIndex(index)
      this.callbackOnSelect()
    },
  )

  callbackOnSelect = () => {
    const { rows, indices } = this.selectedState
    this.props.onSelect(rows, indices)
  }

  get selectedState() {
    const rows = []
    const indices = []
    for (const rowKey of [...this.active]) {
      const index = this.keyToIndex[rowKey]
      indices.push(+index)
      rows.push(this.rows[index])
    }
    return { rows, indices }
  }

  enforceAlwaysSelected = react(
    () => [this.props.alwaysSelected, this.active.size === 0, this.rows.length > 0],
    ([alwaysSelected, noSelection, hasRows]) => {
      ensure('alwaysSelected', alwaysSelected)
      ensure('noSelection', noSelection)
      ensure('hasRows', hasRows)
      const firstValidIndex = this.rows.findIndex(x => x.selectable !== false)
      this.setActive([this.getIndexKey(firstValidIndex)])
    },
  )

  move = (direction: Direction, modifiers: Modifiers = { shift: false }) => {
    const { rows, active } = this
    if (active.size === 0) {
      return
    }
    const lastItemKey = Array.from(active).pop()
    const lastItemIndex = rows.findIndex(row => key(row) === lastItemKey)
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

  moveToId = (rowKey: string) => {
    this.setActive([rowKey])
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
    if (!this.rows.length || index >= this.rows.length) return false
    if (index === -1) return false
    return this.active.has(this.getIndexKey(index))
  }

  setRowActive(index: number, e?: React.MouseEvent) {
    const row = this.rows[index]
    const rowKey = key(row)
    let next = []
    const { active } = this
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

  setRowMouseDown(index: number, e?: React.MouseEvent) {
    if ((e && e.button !== 0) || !this.props.selectable) {
      // set active only with primary mouse button, dont interfere w/context menus
      return
    }
    if (e) {
      e.stopPropagation()
      if (e.shiftKey) {
        // prevent text selection
        e.preventDefault()
      }
    }
    this.dragStartIndex = index
    document.addEventListener('mouseup', this.onStopDragSelecting)
    this.setRowActive(index, e)
  }

  onHoverRow(index: number) {
    const row = this.rows[index]
    const rowKey = key(row)
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
    if (!Array.isArray(next)) {
      console.warn('rows not valid array!', next)
      return
    }
    this.rows = next
  }

  private getIndexKey(index: number) {
    return key(this.rows[index])
  }

  private scrollToIndex(index: number) {
    if (!this.listRef) return
    if (index === -1) return
    this.listRef.scrollToItem(index)
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
