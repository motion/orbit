import { isEqual } from '@o/fast-compare'
import { cloneElement, memo, useMemo } from 'react'

export function memoIsEqualDeep<A>(a: A): A {
  return (memo(a as any, isEqual) as unknown) as A
}
