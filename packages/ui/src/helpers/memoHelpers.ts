import { isEqual } from '@o/fast-compare'
import { cloneElement, memo, useMemo } from 'react'

export function memoIsEqualDeep<A>(a: A): A {
  return (memo(a as any, isEqual) as unknown) as A
}

export const superMemo = (element: React.ReactElement<any>) => {
  return memoIsEqualDeep(props => {
    return useMemo(() => cloneElement(element, props), [])
  })
}
