// @flow
import { store } from '@mcro/black'

@store
class StackItemStore {
  store = null
  result = null
  col = 0
  active = [0, 0]
  constructor({ result, navigate, parent }) {
    this.result = result
    this.navigate = navigate
    this.parent = parent
  }
  setStore(store) {
    this.store = store
  }
  get results() {
    return this.store ? this.store.results : []
  }
  onSelect(item: Object, index: number) {
    // update the highlighted item after we animate
    this.setTimeout(() => {
      this.setActive(0, index)
    }, 50)
    this.navigate(item)
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
    return !!this.results[this.sidebarSelectedIndex].parent
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
    this.active.setActive(this.col, Math.max(0, this.active[this.col] - 1))
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
  currentIndex = 0
  constructor(stack: Array<Object>) {
    const all = stack || []
    this.items = all.map(
      (result, index) =>
        new StackItemStore({
          result,
          navigate: this.navigate,
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
  get down() {
    return this.last.down
  }
  get up() {
    return this.last.up
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
      return
    }
    if (this.last.sidebarSelected) {
      this.navigate(this.last.sidebarSelected)
    }
  }
  push(result) {
    const { last } = this
    this.items = [
      ...this.items,
      new StackItemStore({
        result,
        parent: last,
        navigate: this.navigate,
      }),
    ]
  }
  pop() {
    if (this.items.length > 1) {
      this.items = this.items.slice(0, this.items.length - 1)
    }
  }
  navigate = result => {
    this.push(result)
  }
}
