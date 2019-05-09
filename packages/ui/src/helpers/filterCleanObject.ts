import { isObject, isFunction } from 'lodash'
import { isValidElement } from 'react'

export const filterCleanObject = (obj: any) => {
  if (Array.isArray(obj)) {
    return obj.map(filterCleanObject)
  }
  if (!obj || typeof obj !== 'object') {
    return obj
  }
  let res = {}
  for (const key in obj) {
    const val = obj[key]
    if (isValidElement(val) || isFunction(val)) {
      continue
    }
    if (val && isObject(val)) {
      res[key] = filterCleanObject(val)
    } else {
      res[key] = val
    }
  }
  return res
}
