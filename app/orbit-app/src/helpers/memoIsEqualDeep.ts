import { cloneElement, memo, useMemo } from 'react'
import isEqual from 'react-fast-compare'

export function memoIsEqualDeep<A>(a: A): A {
  return (memo(a as any, isEqual) as unknown) as A
}

export const superMemo = (element: React.ReactElement<any>) => {
  return props => {
    return useMemo(() => cloneElement(element, props), deepEqualProps(props))
  }
}

const Cache = new WeakMap()
let id = 0
export const deepEqualProps = (props: Object): any[] => {
  const res = []
  for (const key in props) {
    const val = props[key]
    if (!val) {
      res.push(val)
      continue
    }
    if (typeof val === 'object') {
      if (Cache.get(val)) {
        res.push(Cache.get(val))
        continue
      }
      id = id + (1 % Number.MAX_VALUE)
      Cache.set(val, id)
      res.push(id)
      continue
    }
    res.push(val)
  }
  return res
}
