import { isEqual } from '@o/fast-compare'
import { always, createStoreContext, ensure, react, useStore } from '@o/use-store'
import { isDefined, selectDefined } from '@o/utils'
import { MutableRefObject } from 'react'

import { defaultSortPressDelay } from '../constants'
import { Config } from '../helpers/configureUI'
import { DynamicListControlled } from './DynamicList'

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
  items?: any[]

  // selections and sorting need to interacts (same concerns)
  // these are sortable props but important
  sortable?: boolean
  pressDelay?: number
}

export const selectablePropKeys = [
  'sortable',
  'items',
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

type SelectState = 'inactive' | 'selecting' | 'sorting'

export class SelectableStore {
  props: SelectableProps

  dragStartIndex?: number = null
  active = new Set<string | number>()
  lastEnter = -1
  listRef: DynamicListControlled = null
  state: SelectState = 'inactive'
  private keyToIndex = {}
  rows = []

  key = (item: any, index: number) => {
    return Config.getItemKey(item, index)
  }

  // async so we have time to render the active state first
  callbackOnSelect = react(
    () => always(this.active),
    async (_, { sleep }) => {
      ensure('this.props.onSelect', !!this.props.onSelect)
      await sleep(16)
      const { rows, indices } = this.getSelectedState()
      this.props.onSelect(rows, indices)
    },
    {
      lazy: true,
    },
  )

  updateRows = react(
    // gnarly bug: if this isnt always() it wont re-run sometimes
    // has to be a bug in useStore somewhere, updateProps or something
    // i was seeing it when i typed "andrey" into search with a lot of items in search
    () => always(this.props.items),
    () => {
      this.rows = this.props.items
      this.keyToIndex = {}
      this.updateActiveAndKeyToIndex()
    },
  )

  callbackRefProp = react(
    () => this.props.selectableStoreRef,
    ref => {
      ensure('onSelectableStore', !!ref)
      ref.current = this
    },
  )

  ensureAlwaysSelected = react(
    () => this.props.alwaysSelected && always(this.rows, this.active),
    () => {
      ensure('alwaysSelected', this.props.alwaysSelected)
      ensure('rowsLen', this.rows.length > 0)
      ensure('activeLen', this.active.size < 1)
      this.selectFirstValid()
    },
  )

  defaultSelectedProp = react(
    () => this.props.defaultSelected,
    async (index, { when }) => {
      ensure('defined', isDefined(index))
      await when(() => !!this.rows.length)
      this.setActiveIndex(index)
    },
  )

  private removeUnselectable = (keys: (string | number)[]) => {
    return keys.filter(k => {
      const row = this.rows[this.keyToIndex[k]]
      if (!row || row.selectable === false) {
        return false
      }
      return true
    })
  }

  private setActive(next: (string | number)[]) {
    // check for disabled rows
    this.updateActiveAndKeyToIndex(next, false)
    const nextFiltered = this.removeUnselectable(next)

    // we filtered it out, just leave it as it is
    if (!!next.length && nextFiltered.length === 0) {
      return
    }

    // dont update if not changed (simple empty check)
    if (this.active.size === 0 && nextFiltered.length === 0) {
      return
    }

    const nextActive = new Set<string | number>(nextFiltered)
    if (isEqual(this.active, nextActive)) {
      return
    }

    this.active = nextActive
  }

  updateActiveAndKeyToIndex(next: (string | number)[] = [...this.active], updateActive = true) {
    const nextActive = []
    for (const rowKey of next) {
      if (!this.keyToIndex[rowKey]) {
        const idx = this.rows.findIndex((r, i) => this.key(r, i) === rowKey)
        if (idx >= 0) {
          nextActive.push(rowKey)
          this.keyToIndex[rowKey] = idx
        }
      }
    }
    if (updateActive) {
      this.setActive(nextActive)
    }
  }

  selectFirstValid() {
    const firstValidIndex = this.rows.findIndex(x => x && x.selectable !== false)
    if (firstValidIndex === -1) {
      console.warn('no selecatble row!', this.rows)
      return
    }
    this.setActiveIndex(firstValidIndex)
  }

  getSelectedState() {
    const rows = []
    const indices = []
    for (const rowKey of [...this.active]) {
      const index = this.keyToIndex[rowKey]
      indices.push(+index)
      rows.push(this.rows[index])
    }
    return { rows, indices }
  }

  move = (direction: Direction, modifiers: Modifiers = { shift: false }) => {
    const { rows, active } = this

    let next = [...active]

    if (active.size === 0) {
      return
    }
    if (this.props.selectable === false) {
      return
    }

    const lastKey = [...active].pop()
    const lastIndex = this.keyToIndex[lastKey]
    const step = direction === Direction.up ? -1 : 1
    let nextIndex: number = lastIndex
    let found: number

    while (typeof found === 'undefined') {
      nextIndex += step
      if (!rows[nextIndex]) break
      if (rows[nextIndex].selectable === false) continue
      found = nextIndex
    }
    if (modifiers.shift === false) {
      next = []
    }
    // only move if we found something to go to
    if (isDefined(found)) {
      next.push(this.getIndexKey(nextIndex))
      this.setActive(next)
      this.scrollToIndex(nextIndex)
    }
    return found
  }

  moveToId = (rowKey: string) => {
    this.setActive([rowKey])
  }

  setListRef(ref: DynamicListControlled) {
    if (this.listRef !== ref) {
      this.listRef = ref
    }
  }

  // returns only the index of the first row!
  get activeIndex(): number {
    const maybeIndex = this.active.size && this.keyToIndex[[...this.active][0]]
    return +maybeIndex === maybeIndex ? maybeIndex : -1
  }

  setActiveIndex = (index: number) => {
    if (index === -1) {
      this.setActive([])
    } else {
      if (!this.rows.length) return
      const key = this.getIndexKey(index)
      this.keyToIndex[key] = index
      this.setActive([key])
    }
  }

  isActiveIndex(index: number) {
    if (!this.rows.length || index >= this.rows.length) return false
    if (index === -1) return false
    return this.active.has(this.getIndexKey(index))
  }

  setRowActive(index: number, e?: React.MouseEvent) {
    const row = this.rows[index]
    const rowKey = this.key(row, index)
    this.keyToIndex[rowKey] = index
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

  sortableMouseDownIndex = -1
  sortableMouseDownTm = null

  setRowMouseDown(index: number, e?: React.MouseEvent) {
    document.body.classList.add('selectable-mouse-down')

    if ((e && e.button !== 0) || !this.props.selectable) {
      // set active only with primary mouse button, dont interfere w/context menus
      return
    }
    if (e) {
      // WARNING I just disabled this
      // e.stopPropagation()
      if (e.shiftKey) {
        // prevent text selection
        e.preventDefault()
      }
    }
    this.dragStartIndex = index
    document.addEventListener('mouseup', this.onStopDragSelecting)

    // #sorting
    // we dont want to select immediately when dealing with press delay
    // so we need to do two things:
    //   1: switch to onMouseUp strategy for single selection
    //   2: still select this row if they drag down for multiple, and therefore avoid mouseup

    if (this.props.sortable) {
      if (this.sortableMouseDownIndex !== index) {
        this.clearOnSelectOrSortWatchers()
      }

      this.sortableMouseDownIndex = index

      // ok now we want to trigger selection mode in two cases:
      //  1. if they move their mouse more than distance
      const start = [e.pageX, e.pageY]
      const checkForDistanceSelect = e => {
        if (this.state === 'sorting' && this.clearMouseMoveWatcher) {
          return this.clearMouseMoveWatcher()
        }
        // if we moved enough, consider it a select not sort
        // distance move until cancel
        const cur = [e.pageX, e.pageY]
        if (
          Math.abs(cur[0] - start[0]) > 16 ||
          Math.abs(cur[0] + start[0]) > 16 ||
          Math.abs(cur[1] - start[1]) > 16 ||
          Math.abs(cur[1] + start[1]) > 16
        ) {
          this.state = 'selecting'
          this.setRowActive(index)
          this.clearOnSelectOrSortWatchers()
        }
      }
      window.addEventListener('mousemove', checkForDistanceSelect)
      this.clearMouseMoveWatcher = () => {
        window.removeEventListener('mousemove', checkForDistanceSelect)
      }

      //  2. once the pressDelay window has passed, which may be same as #1 need to test
      this.sortableMouseDownTm = setTimeout(() => {
        // but only if we dont start sorting
        if (this.state === 'sorting') {
          this.state = 'selecting'
          this.setRowActive(index)
          this.clearOnSelectOrSortWatchers()
        }
      }, selectDefined(this.props.pressDelay, defaultSortPressDelay) + 10)
    } else {
      this.state = 'selecting'
      this.setRowActive(index, e)
    }
  }

  private clearMouseMoveWatcher = null
  private clearOnSelectOrSortWatchers = () => {
    clearTimeout(this.sortableMouseDownTm)
    this.clearMouseMoveWatcher && this.clearMouseMoveWatcher()
  }

  private onStopDragSelecting = () => {
    this.clearOnSelectOrSortWatchers()
    document.body.classList.remove('selectable-mouse-down')
    this.dragStartIndex = null

    // onMouseUp, finish selecting this row! (see #sorting)
    if (this.state === 'sorting') {
      // we did a sort, so ignore the original select
      this.sortableMouseDownIndex = -1
    } else {
      if (this.props.sortable && this.sortableMouseDownIndex > -1) {
        this.setRowActive(this.sortableMouseDownIndex)
        this.sortableMouseDownIndex = -1
      }
    }

    this.state = 'inactive'
    document.removeEventListener('mouseup', this.onStopDragSelecting)
  }

  onHoverRow(index: number) {
    // prevent race, this makes it not clear after initial multi-select w/sortable list
    this.clearOnSelectOrSortWatchers()

    if (this.state === 'sorting') {
      console.debug('Preventing selection while sorting')
      return
    }

    // finish select in the case of mousemove (see #sorting)
    const sindex = this.sortableMouseDownIndex
    if (sindex > -1) {
      this.sortableMouseDownIndex = -1
      this.onHoverRow(sindex)
    }

    const row = this.rows[index]
    const rowKey = this.key(row, index)
    if (!this.props.selectable) {
      return false
    }
    const direction = this.lastEnter > index ? Direction.up : Direction.down
    this.lastEnter = index
    const { dragStartIndex } = this
    const isMouseDown = typeof dragStartIndex === 'number'
    if (isMouseDown) {
      if (direction === Direction.down) {
        this.scrollToIndex(index + 1)
      } else {
        this.scrollToIndex(index - 1)
      }
      if (this.props.selectable === 'multi') {
        const startKey = this.getIndexKey(dragStartIndex)
        this.setActive(this.selectInRange(startKey, rowKey))
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
      this.move(direction, { shift: e.shiftKey })
    }
  }

  clearSelected = () => {
    this.setActive([])
  }

  setSorting = async (val: boolean) => {
    this.state = val ? 'sorting' : 'inactive'
    this.onStopDragSelecting()
  }

  private getIndexKey(index: number) {
    return this.key(this.rows[index], index)
  }

  private scrollToIndex(index: number) {
    if (!this.listRef) return
    if (index < 0) return
    if (!isDefined(index)) return
    if (index === 0) {
      // bugfix: alwaysselected would call scroll super early and react-window has a bug
      // where it would scroll down below 0px. perhaps due to not being measured yet right?
      this.listRef.scrollTo(0)
    } else {
      this.listRef.scrollToItem(index)
    }
  }

  private selectInRange = (fromKey: string | number, toKey: string | number): string[] => {
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

const Context = createStoreContext(SelectableStore)

export const SelectableStoreProvider = Context.ProvideStore

// will grab the parent store if its provided, otherwise create its own
export function useCreateSelectableStore(props?: SelectableProps, options = { react: false }) {
  const inactive = !!props.selectableStore || !props.selectable
  const newStore = useStore(inactive ? false : SelectableStore, props, options)
  return props.selectableStore || newStore
}

export function useSelectableStore() {
  return Context.useStore()
}
