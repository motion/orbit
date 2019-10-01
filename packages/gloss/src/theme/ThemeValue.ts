import { ThemeValueLike } from '@o/css'

export class ThemeValue<A> implements ThemeValueLike<A> {
  constructor(public cssVariable: string, public value: A) {}

  getCSSValue() {
    return this.value
  }

  get() {
    return this.value
  }
}
