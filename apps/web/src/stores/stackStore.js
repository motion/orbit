// @flow
import { store } from '@mcro/black'

@store
class StackItemStore {
  store = null
  mainStore = null
  result = null
  col = 0
  active = [0, 0]
  id = null
  constructor({ result, stack, parent }) {
    this.result = result
    this.id = this.result.id
    this.stack = stack
    this.parent = parent
  }
  setStore(store) {
    this.store = store
  }
  setMainStore(store) {
    this.mainStore = store
  }
  get results() {
    return this.store ? this.store.results : []
  }
  onSelect(item: Object, index: number) {
    // update the highlighted item after we animate
    this.setTimeout(() => {
      this.setActive(0, index)
    }, 50)
    this.stack.navigate(item)
  }
  get selectedIndex() {
    return this.active[this.col]
  }
  get sidebarSelectedIndex() {
    return this.active[0]
  }
  get mainSelectedIndex() {
    return this.active[1]
  }
  get sidebarSelectedIsNav() {
    if (!this.results) {
      return false
    }
    const result = this.results[this.sidebarSelectedIndex]
    return result && result.isParent
  }
  get sidebarSelected() {
    const selected = this.results[this.sidebarSelectedIndex]
    if (selected && selected.isParent) {
      return this.parent.sidebarSelected
    }
    return selected || this.result
  }
  get selectedKey() {
    const { sidebarSelected } = this
    return `${sidebarSelected.type}${sidebarSelected.id}`
  }
  get firstIndex() {
    return this.active[0]
  }
  get secondIndex() {
    return this.active[1]
  }
  down() {
    this.setActive(
      this.col,
      Math.min(this.results.length - 1, this.active[this.col] + 1)
    )
  }
  up() {
    this.setActive(this.col, Math.max(0, this.active[this.col] - 1))
  }
  right() {
    this.col = Math.min(1, this.col + 1)
  }
  left() {
    this.col = Math.max(0, this.col - 1)
  }
  setActive(col: number, value: number) {
    this.active[col] = value
    this.active = [...this.active]
  }
}

@store
export default class StackStore {
  items = []
  version = 0
  constructor(stack: Array<Object>) {
    const all = stack || []
    this.items = all.map(
      (result, index) =>
        new StackItemStore({
          result,
          stack: this,
          parent: all[index - 1],
        })
    )
  }
  get length() {
    return this.items.length
  }
  get last() {
    return this.items[this.items.length - 1]
  }
  focus(index) {
    this.last.setActive(0, index)
  }
  get down() {
    return this.last.down
  }
  get up() {
    return this.last.up
  }
  get col() {
    return this.last.col
  }
  left() {
    if (this.last.col) {
      this.last.left()
    } else {
      this.pop()
    }
  }
  right() {
    if (!this.last) {
      return
    }
    if (this.last.sidebarSelectedIsNav) {
      this.last.right()
      return
    }
    if (this.last.sidebarSelected) {
      this.navigate(this.last.sidebarSelected)
    }
  }
  push(result) {
    this.version++
    const { last } = this
    this.items = [
      ...this.items,
      new StackItemStore({
        result,
        parent: last,
        stack: this,
      }),
    ]
  }
  pop() {
    if (this.items.length > 1) {
      this.version++
      this.items = this.items.slice(0, this.items.length - 1)
    }
  }
  navigate = result => {
    this.push(result)
  }
  replace = result => {
    this.pop()
    this.push(result)
  }
  replaceInPlace = result => {
    this.last.result = result
  }
}
