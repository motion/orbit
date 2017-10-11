// @flow
import { store } from '@mcro/black'

@store
class StackItem {
  store = null
  data = null
  activeColumn = 0
  active = [0, 0]
  constructor(data) {
    this.data = data
  }
  setStore(store) {
    this.store = store
  }
  get results() {
    return this.store.results
  }
  get selectedIndex() {
    return this.active[this.activeColumn]
  }
  get selectedResult() {
    return this.results[this.active[0]]
  }
  get firstIndex() {
    return this.active[0]
  }
  get secondIndex() {
    return this.active[1]
  }
  down() {
    this.active[this.activeColumn]++
    this.active = [...this.active]
  }
  up() {
    this.active[this.activeColumn]--
    this.active = [...this.active]
  }
  right() {
    this.activeColumn += 1
  }
  left() {
    this.activeColumn -= 1
  }
}

@store
export default class StackStore {
  items = []
  currentIndex = 0

  constructor(stack: Array<Object>) {
    const all = stack || []
    this.items = all.map(x => new StackItem(x))
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

  get left() {
    return this.last.left
  }

  get right() {
    return this.last.right
  }

  push(item) {
    this.items = [...this.items, item]
  }

  pop() {
    this.items = this.items.slice(0, this.items.length - 1)
  }

  navigate(item) {
    this.push(item)
  }
}
