import isEqual from '@mcro/fast-compare'
import { cloneElement, memo, useMemo } from 'react'

export function memoIsEqualDeep<A>(a: A): A {
  return (memo(a as any, isEqual) as unknown) as A
}

export const superMemo = (element: React.ReactElement<any>) => {
  return props => {
    return useMemo(() => cloneElement(element, props), isEqual)
  }
}
