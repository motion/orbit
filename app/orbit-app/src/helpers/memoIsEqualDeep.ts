import { memo } from 'react'
import isEqual from 'react-fast-compare'

export function memoIsEqualDeep<A>(a: A): A {
  return (memo(a as any, isEqual) as unknown) as A
}
