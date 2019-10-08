import { CSSPropertyValThemeFn, cssValue } from '@o/css/src/css'

export function resolveThemeValues<A = { [key: string]: any }>(
  props: A,
): { [key in keyof A]: Exclude<A[key], CSSPropertyValThemeFn> } {
  return Object.keys(props).reduce((acc, key) => {
    acc[key] = cssValue(key, props[key])
    return acc
  }, {}) as any
}
