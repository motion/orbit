import { ThemeValueLike } from '@o/css'

/**
 * Represents a value in a way that makes it easier for us to track
 * and understand which components can be safely not re-rendered on
 * theme changes.
 */
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

/**
 * Helper for easier, functional style of resolving ThemeValues.
 * This *will not* cause re-renders when used with CSS Variables.
 */
export const resolveValueSafe = (val?: any) => {
  return val instanceof ThemeValue ? val.getSafe() : val
}

/**
 * Helper for easier, functional style of resolving ThemeValues.
 * This *will* cause re-renders, even when used with CSS Variables.
 */
export const resolveValue = (val?: any) => {
  return val instanceof ThemeValue ? val.get() : val
}
