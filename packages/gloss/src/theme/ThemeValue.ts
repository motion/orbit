import { ThemeValueLike } from '@o/css'

export class ThemeValue<A> implements ThemeValueLike<A> {
  constructor(public cssVariable: string, public value: A) {}

  cssVariableSafeKeys = ['cssVariable', 'getSafe']

  getCSSValue() {
    return this.value
  }

  getSafe() {
    return this.value
  }

  get() {
    return this.value
  }

  toString() {
    return `${this.value}`
  }
}
