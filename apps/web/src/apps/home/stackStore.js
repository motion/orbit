// @flow
import { store } from '@mcro/black'

@store
class StackItem {
  data = null
  activeColumn = 0
  activeRow = [0, 0]
  constructor(data) {
    this.data = data
  }
  down() {
    this.activeRow[this.activeColumn]++
  }
  up() {
    this.activeRow[this.activeColumn]--
  }
  right() {
    this.activeColumn++
  }
  left() {
    this.activeColumn--
  }
}

@store
export default class StackStore {
  stack = []
  currentIndex = 0

  constructor(stack: Array<Object>) {
    const all = stack || []
    this.stack = all.map(x => new StackItem(x))
  }

  get length() {
    return this.stack.length
  }

  get last() {
    return this.stack[this.stack.length - 1]
  }

  get lastTwo() {
    return this.stack.slice(this.length - 2, this.length)
  }

  push(item) {
    this.stack = [...this.stack, item]
  }

  pop() {
    this.stack = this.stack.slice(0, this.stack.length - 1)
  }

  navigate(item) {
    this.push(item)
  }
}
