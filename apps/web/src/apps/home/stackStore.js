// @flow
import { store } from '@mcro/black'

@store
class StackItem {
  store = null
  data = null
  col = 0
  active = [0, 0]
  constructor(data, props) {
    this.data = data
    this.props = props
  }
  setStore(store) {
    this.store = store
  }
  get results() {
    return this.store ? this.store.results : []
  }
  onSelect(item: Object) {
    this.props.navigate(item)
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
  get sidebarSelected() {
    return this.results[this.sidebarSelectedIndex] || this.data
  }
  get sidebarActive() {
    return this.data
  }
  get firstIndex() {
    return this.active[0]
  }
  get secondIndex() {
    return this.active[1]
  }
  down() {
    this.active[this.col] = Math.min(
      this.results.length - 1,
      this.active[this.col] + 1
    )
    this.active = [...this.active]
  }
  up() {
    this.active[this.col] = Math.max(0, this.active[this.col] - 1)
    this.active = [...this.active]
  }
  right() {
    this.col = Math.min(1, this.col + 1)
  }
  left() {
    this.col = Math.max(0, this.col - 1)
  }
}

@store
export default class StackStore {
  items = []
  currentIndex = 0
  constructor(stack: Array<Object>) {
    const all = stack || []
    this.items = all.map(x => new StackItem(x, { navigate: this.navigate }))
  }
  get length() {
    return this.items.length
  }
  get last() {
    return this.items[this.items.length - 1]
  }
  get lastTwo() {
    return this.items.slice(this.length - 2, this.length)
  }
  get selected() {
    return this.last.selected
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
    if (this.last.selectedResult) {
      this.navigate(this.last.selectedResult)
    }
  }
  push(item) {
    this.items = [...this.items, item]
  }
  pop() {
    if (this.items.length > 1) {
      this.items = this.items.slice(0, this.items.length - 1)
    }
  }
  navigate = item => {
    this.push(new StackItem(item))
  }
}
