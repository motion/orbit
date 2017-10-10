import { store } from '@mcro/black'

@store
export default class StackStore {
  stack = []
  active = 0

  get last() {
    return this.stack[this.stack.length - 1]
  }

  get length() {
    return this.stack.length
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
