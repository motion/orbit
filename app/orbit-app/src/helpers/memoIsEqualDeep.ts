import { memo } from 'react'
import isEqual from 'react-fast-compare'

export function memoIsEqualDeep(a: any) {
  return memo(a, isEqual)
}
