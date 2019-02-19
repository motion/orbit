import { isEqual } from '@mcro/fast-compare'
import { memo } from 'react'

export function memoDeep<A>(a: A): A {
  return (memo(a as any, isEqual) as unknown) as A
}
